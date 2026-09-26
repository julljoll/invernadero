import React from 'react';
import { Box, Cylinder, Translation, Union, Difference } from 'react-cad';

// Parametric CSG Greenhouse Model
export default function GreenhouseCAD() {
  const width = 5;
  const length = 12;
  const colHeight = 3.0;

  return (
    <Union>
      {/* Columna Base 1 */}
      <Translation z={0} y={colHeight/2} x={width/2}>
        <Box center={[0,0,0]} x={0.1} y={colHeight} z={0.1} />
      </Translation>

      {/* Columna Base 2 */}
      <Translation z={0} y={colHeight/2} x={-width/2}>
        <Box center={[0,0,0]} x={0.1} y={colHeight} z={0.1} />
      </Translation>

      {/* Viga Transversal (Truss Bottom) */}
      <Translation z={0} y={colHeight} x={0}>
        <Box center={[0,0,0]} x={width} y={0.05} z={0.05} />
      </Translation>

      {/* Representación sólida del suelo */}
      <Translation z={0} y={-0.1} x={0}>
        <Box center={[0,0,0]} x={width + 1} y={0.2} z={length + 1} />
      </Translation>

      {/* Volumen general semitransparente que simula el techo */}
      <Difference>
        <Translation z={0} y={colHeight + 0.75} x={0}>
           <Box center={[0,0,0]} x={width} y={1.5} z={length} />
        </Translation>
        {/* Hueco interno para que quede como pared */}
        <Translation z={0} y={colHeight + 0.75} x={0}>
           <Box center={[0,0,0]} x={width-0.2} y={1.6} z={length-0.2} />
        </Translation>
      </Difference>
    </Union>
  );
}
