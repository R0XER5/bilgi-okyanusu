<div className="card create-post">
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Başlık"
      className="input-field"
      style={{ 
        marginBottom: '16px',
        color: '#000000'
      }}
      required
    />
    
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Ne hakkında yazmak istersiniz?"
      className="input-field"
      style={{ 
        minHeight: '150px',
        resize: 'vertical',
        marginBottom: '16px',
        color: '#000000'
      }}
      required
    />

    <input
      type="text"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      placeholder="Etiketler (virgülle ayırın)"
      className="input-field"
      style={{ 
        marginBottom: '16px',
        color: '#000000'
      }}
    />

    <button type="submit" className="btn btn-primary">
      Paylaş
    </button>
  </form>
</div> 