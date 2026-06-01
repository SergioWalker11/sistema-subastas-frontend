export const formatearMoneda = (monto) =>
  Number(monto).toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });
