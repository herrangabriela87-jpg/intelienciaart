const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Función matemática basada en el documento
function calcularFachada(perimetro, proporcionBase = 3, costoM2 = 80000, costoFijo = 4500000) {
  // Ecuación: 2(proporcionBase * x) + 2(x) = perimetro
  const factorX = (2 * proporcionBase) + 2;
  const altura = perimetro / factorX; // x
  const base = proporcionBase * altura; // 3x
  const area = base * altura; // b * h
  const costoMaterial = area * costoM2;
  const costoTotal = costoMaterial + costoFijo;

  return {
    ecuacion: `2(${proporcionBase}x) + 2(x) = ${perimetro}`,
    despeje: `${factorX}x = ${perimetro} => x = ${altura}`,
    dimensiones: {
      altura: Number(altura.toFixed(2)),
      base: Number(base.toFixed(2)),
      perimetro: Number(perimetro)
    },
    areaTotal: Number(area.toFixed(2)),
    presupuesto: {
      costoM2,
      costoFijo,
      costoMaterial,
      costoTotal
    }
  };
}

// Endpoint de cálculo
app.post('/api/calcular', (req, res) => {
  const { perimetro, proporcionBase, costoM2, costoFijo } = req.body;

  if (!perimetro || perimetro <= 0) {
    return res.status(400).json({ error: 'El perímetro debe ser mayor a 0.' });
  }

  const resultado = calcularFachada(
    Number(perimetro),
    Number(proporcionBase || 3),
    Number(costoM2 || 80000),
    Number(costoFijo || 4500000)
  );

  res.json(resultado);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});