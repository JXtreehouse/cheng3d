export default `
precision mediump float;
varying vec2 v_uv;

uniform sampler2D u_diffuseMap;

uniform vec2 u_pixelSize;

vec4 o_fragColor;

// Nvidia的FXAA算法
void main(){
    const float FXAA_SPAN_MAX = 8.0;
    const float FXAA_REDUCE_MUL = 1.0 / 8.0;
    const float FXAA_REDUCE_MIN = 1.0 / 128.0;

    vec3 rgbNW = texture2D(u_diffuseMap, v_uv + (vec2(-1.0, -1.0) * u_pixelSize)).xyz;
    vec3 rgbNE = texture2D(u_diffuseMap, v_uv + (vec2(1.0, -1.0) * u_pixelSize)).xyz;
    vec3 rgbSW = texture2D(u_diffuseMap, v_uv + (vec2(-1.0, 1.0) * u_pixelSize)).xyz;
    vec3 rgbSE = texture2D(u_diffuseMap, v_uv + (vec2(1.0, 1.0) * u_pixelSize)).xyz;
    vec3 rgbM = texture2D(u_diffuseMap, v_uv).xyz;

    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);

    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);

    dir = min(vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),
        max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
        dir * rcpDirMin)) * u_pixelSize;

    vec3 rgbA = 0.5 * (
        texture2D(u_diffuseMap, v_uv.xy + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture2D(u_diffuseMap, v_uv.xy + dir * (2.0 / 3.0 - 0.5)).xyz);

    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture2D(u_diffuseMap, v_uv.xy - dir * 0.5).xyz +
        texture2D(u_diffuseMap, v_uv.xy + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if((lumaB < lumaMin) || (lumaB > lumaMax)){
        o_fragColor.xyz = rgbA;
    }else{
        o_fragColor.xyz = rgbB;
    }
 
    gl_FragColor = vec4(o_fragColor.xyz, 1.0);
    // gl_FragColor = vec4(pow(o_fragColor.xyz, vec3(1.0/2.2)), 1.0);
}
`