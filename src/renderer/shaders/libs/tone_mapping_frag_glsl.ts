export default `
precision mediump float;

varying vec2 o_uv;

uniform sampler2D u_diffuseMap;
uniform sampler2D u_bloomMap;
uniform sampler2D u_lumMap;
uniform vec2 u_lumPCT;
uniform vec2 u_pixelSize;

vec3 ACESToneMapping(vec3 color, float avgLum, float adapted_lum)
{
	const float A = 2.51;
	const float B = 0.03;
	const float C = 2.43;
	const float D = 0.59;
	const float E = 0.14;

	color *= adapted_lum / avgLum;
	return (color * (A * color + B)) / (color * (C * color + D) + E);
}

void main()
{
    vec3 lum_fact = vec3(0.27, 0.67, 0.06);
    vec3 color = texture2D(u_diffuseMap, o_uv).xyz;

    float ave_lum = texture2D(u_lumMap, vec2(0.5, 0.5)).x;
    
    color = ACESToneMapping(color, ave_lum, u_lumPCT.x);

    vec3 bloom = texture2D(u_bloomMap, o_uv).xyz * 1.3;
    vec3 final_color = clamp(color + bloom, 0.0, 1.0);

    gl_FragColor = vec4(final_color, 1.0);
}
`;