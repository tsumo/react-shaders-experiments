export const defaultVertexShader = `
precision highp float;

attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;

export const defaultFragmentShader = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution;
	gl_FragColor = vec4(st.x, st.y, abs(sin(u_time)), 1.0);
}
`;
