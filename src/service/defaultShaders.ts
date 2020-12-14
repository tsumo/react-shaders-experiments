export const defaultVertexShader = `
precision highp float;

attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;

export const defaultFragmentShader = `
precision highp float;

uniform float time;

void main() {
	gl_FragColor = vec4(abs(sin(time)), abs(cos(time * 1.3)), abs(tan(time * 1.5)), 1.0);
}
`;
