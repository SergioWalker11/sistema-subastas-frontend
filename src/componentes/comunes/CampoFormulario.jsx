function CampoFormulario({ etiqueta, tipo = 'text', valor, onChange, nombre, placeholder, requerido = false, error = '' }) {
  return (
    <div className="campo-formulario">
      <label className="campo-etiqueta" htmlFor={nombre}>{etiqueta}</label>
      <input
        className={`campo-entrada ${error ? 'campo-entrada--error' : ''}`}
        type={tipo}
        id={nombre}
        name={nombre}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        required={requerido}
      />
      {error && <span className="campo-error">{error}</span>}
    </div>
  );
}

export default CampoFormulario;
