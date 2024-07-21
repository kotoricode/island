#version 300 es
precision mediump float;

in vec2 v_texcoord;
uniform sampler2D u_texture;
uniform uint u_pickColor;
out uvec4 out_color;

void main()
{
    float textureAlpha = texture(u_texture, v_texcoord).a;

    if (textureAlpha == 0.0)
    {
        discard;
    }

    uint pickColor = u_pickColor * uint(textureAlpha);
    out_color = uvec4(pickColor, 0, 0, 255);
}
