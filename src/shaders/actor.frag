#version 300 es
precision mediump float;

in vec2 v_texcoord;
uniform sampler2D u_texture;
uniform float u_highlightFactor;
uniform vec2 u_uvOffset;
uniform vec2 u_uvSize;
uniform vec2 u_uvRepeat;
out vec4 out_color;

const vec3 HIGHLIGHT = vec3(1);

void main()
{
    vec2 texcoord = u_uvOffset + mod(v_texcoord * u_uvRepeat - u_uvOffset, u_uvSize);
    vec4 textureColor = texture(u_texture, texcoord);
    vec3 highlightedColor = mix(textureColor.rgb, HIGHLIGHT, u_highlightFactor);
    out_color = vec4(highlightedColor, textureColor.a);
}
