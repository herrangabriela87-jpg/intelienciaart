const form = document.getElementById('calc-form');

const formatCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

async function ejecutarCalculo(e) {
  if (e) e.preventDefault();

  const payload = {
    perimetro: document.getElementById('perimetro').value,
    proporcionBase: document.getElementById('proporcion').value,
    costoM2: document.getElementById('costoM2').value,
    costoFijo: document.getElementById('costoFijo').value
  };

  try {
    const response = await fetch('/api/calcular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) return alert(data.error);

    // Actualizar Hero
    document.getElementById('hero-area').textContent = data.areaTotal;

    // Actualizar Tarjeta 1 (Diagrama)
    document.getElementById('diag-base').textContent = `b = ${data.dimensiones.base}m (${payload.proporcionBase}x)`;
    document.getElementById('diag-altura').textContent = `h = ${data.dimensiones.altura}m (x)`;

    // Actualizar Tarjeta 2 (Álgebra)
    document.getElementById('res-ecuacion').textContent = data.ecuacion;
    document.getElementById('res-despeje').textContent = data.despeje;
    document.getElementById('res-altura').textContent = `${data.dimensiones.altura} m`;
    document.getElementById('res-base').textContent = `${data.dimensiones.base} m`;

    // Actualizar Tarjeta 3 (Área)
    document.getElementById('res-formula-sub').textContent = `A = ${data.dimensiones.base} · ${data.dimensiones.altura}`;
    document.getElementById('res-area').textContent = `${data.areaTotal} m²`;

    // Actualizar Tarjeta 4 (Costos COP)
    document.getElementById('res-material').textContent = formatCOP(data.presupuesto.costoMaterial);
    document.getElementById('res-fijo').textContent = formatCOP(data.presupuesto.costoFijo);
    document.getElementById('res-total').textContent = formatCOP(data.presupuesto.costoTotal);

  } catch (err) {
    console.error('Error calculando la fachada:', err);
  }
}

form.addEventListener('submit', ejecutarCalculo);
window.addEventListener('DOMContentLoaded', () => ejecutarCalculo());