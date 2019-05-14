#ifdef GL_ES
precision highp float;
#endif

varying float height_percentage;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord); 
	vec4 heightmap = texture2D(uSampler2, vTextureCoord);
	vec4 altimetry = texture2D(uSampler3, vec2(0, height_percentage));

	gl_FragColor  = altimetry;
}