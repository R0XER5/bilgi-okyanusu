// OpenAI GPT API ile raporları değerlendiren servis
const analyzeReport = async (report, content) => {
  try {
    // OpenAI API anahtarı (güvenli bir şekilde saklanmalı)
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API anahtarı bulunamadı');
    }

    // Rapor ve içeriği birleştir
    const textToAnalyze = `
    RAPORLANAN İÇERİK:
    ${content}

    RAPOR BİLGİLERİ:
    Rapor Nedeni: ${report.reason}
    Rapor Detayları: ${report.details}
    `;

    // GPT'ye gönderilecek istek
    const prompt = `
    Lütfen aşağıdaki raporlanan içeriği ve rapor bilgilerini detaylı olarak analiz et.
    Hem raporlanan içeriği hem de rapor nedenini birlikte değerlendir.

    DEĞERLENDİRME KRİTERLERİ:
    1. Küfür ve Hakaret:
       - İçerikte açık veya gizli küfür var mı?
       - Hakaret içeren ifadeler mevcut mu?
       - Kişilik haklarına saldırı var mı?

    2. Nefret Söylemi:
       - Herhangi bir gruba karşı nefret söylemi var mı?
       - Ayrımcı ifadeler kullanılmış mı?
       - Irkçı, cinsiyetçi veya ayrımcı alt metinler var mı?

    3. Taciz ve Zorbalık:
       - Sistematik taciz belirtileri var mı?
       - Tehdit unsurları mevcut mu?
       - Psikolojik baskı veya zorbalık var mı?

    4. Spam ve Yanıltıcı İçerik:
       - Ticari spam içeriyor mu?
       - Yanıltıcı bilgi veya sahte haber var mı?
       - Bağlam dışı veya alakasız içerik paylaşımı var mı?

    5. Şiddet:
       - Fiziksel şiddet içeriyor mu?
       - Şiddeti özendiren ifadeler var mı?
       - Kendine veya başkalarına zarar vermeye yönelik içerik var mı?

    6. Telif Hakkı:
       - İçerik başka yerden kopyalanmış mı?
       - Kaynak gösterilmeden alıntı yapılmış mı?
       - Telif hakkı ihlali olabilecek materyal var mı?

    7. Diğer Zararlı İçerikler:
       - Yasadışı faaliyetlere teşvik var mı?
       - Topluluk kurallarını ihlal eden başka unsurlar var mı?
       - Genel ahlak ve etik değerlere aykırı içerik var mı?

    RAPOR VE İÇERİK:
    ${textToAnalyze}

    Lütfen her kategori için 0-100 arası bir risk skoru ver ve detaylı gerekçelerini açıkla.
    Ayrıca, raporun haklı olup olmadığına dair genel bir değerlendirme yap.
    `;

    // OpenAI API'ye istek gönder
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'Sen deneyimli bir içerik moderatörüsün. İçerikleri tarafsız ve adil bir şekilde değerlendiriyorsun. Raporları ve içerikleri detaylı analiz edip, topluluk kurallarına uygunluğunu kontrol ediyorsun. Kararlarını verirken hem rapor eden kişinin endişelerini hem de içerik sahibinin haklarını göz önünde bulunduruyorsun.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('API yanıt vermedi: ' + data.error?.message);
    }

    const analysis = data.choices[0].message.content;

    // GPT'nin yanıtını işle
    const riskScores = {
      profanity: 0,
      hate_speech: 0,
      harassment: 0,
      spam: 0,
      violence: 0,
      copyright: 0,
      other: 0
    };

    // Yanıttan risk skorlarını çıkar
    const scoreMatches = analysis.match(/(\d+)\/100/g);
    if (scoreMatches) {
      const scores = scoreMatches.map(s => parseInt(s));
      riskScores.profanity = scores[0] || 0;
      riskScores.hate_speech = scores[1] || 0;
      riskScores.harassment = scores[2] || 0;
      riskScores.spam = scores[3] || 0;
      riskScores.violence = scores[4] || 0;
      riskScores.copyright = scores[5] || 0;
      riskScores.other = scores[6] || 0;
    }

    // En yüksek risk skorunu bul
    const maxRiskScore = Math.max(...Object.values(riskScores));
    const maxRiskCategory = Object.entries(riskScores)
      .find(([_, score]) => score === maxRiskScore)?.[0];

    // Risk kategorilerini Türkçe'ye çevir
    const categoryNames = {
      profanity: 'Küfür ve Hakaret',
      hate_speech: 'Nefret Söylemi',
      harassment: 'Taciz',
      spam: 'Spam',
      violence: 'Şiddet',
      copyright: 'Telif Hakkı İhlali',
      other: 'Diğer'
    };

    // Genel değerlendirme metnini bul
    const evaluationMatch = analysis.match(/Genel değerlendirme:[\s\S]*?(?=\n\n|$)/i);
    const evaluationText = evaluationMatch ? evaluationMatch[0] : '';

    // Sonucu değerlendir
    if (maxRiskScore >= 50) {
      return {
        accepted: true,
        confidence: maxRiskScore / 100,
        reason: `Yüksek riskli ${categoryNames[maxRiskCategory]} içeriği tespit edildi.\n\n${evaluationText}`,
        analysis: analysis,
        riskScores: riskScores
      };
    } else {
      return {
        accepted: false,
        confidence: maxRiskScore / 100,
        reason: `İçerik topluluk kurallarını ihlal etmiyor.\n\n${evaluationText}`,
        analysis: analysis,
        riskScores: riskScores
      };
    }

  } catch (error) {
    console.error('Rapor analiz edilirken hata oluştu:', error);
    return {
      accepted: null,
      confidence: 0,
      reason: 'Yapay zeka tarafından inceleme sırasında bir hata oluştu: ' + error.message
    };
  }
};

export default analyzeReport; 