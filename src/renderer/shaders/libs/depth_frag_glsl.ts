export default `
precision mediump float;

#ifdef ALPHA_TEST
    varying vec2 v_uv;
    uniform sampler2D u_ODMap;
    uniform sampler2D u_diffuseMap;
    uniform vec4 u_baseColor;
#endif

varying float v_depth;

#include <encodeFloat2RGBA>

void main()
{
    #ifdef ALPHA_TEST
        vec4 bc = texture2D(u_diffuseMap, v_uv);
        bc.xyz = pow(bc.xyz, vec3(2.2));
        vec4 baseColor = bc * u_baseColor;

        float alpha = texture2D(u_ODMap, fract(gl_FragCoord.xy * vec2(1.0 / 16.0))).a;
        if (baseColor.a <= alpha) {
            discard;
        }
    #endif

    float depth = v_depth; //exp(v_depth * 80.0);
    gl_FragColor = vec4(encodeFloat2RGBA(v_depth));
    // gl_FragColor = vec4(depth);
}
`;
