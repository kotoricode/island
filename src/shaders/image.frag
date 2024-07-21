#version 300 es
precision mediump float;

in vec2 v_texcoord;
uniform float u_fadeFactor;
uniform uint u_timeOfDay;
uniform sampler2D u_texture;
uniform bool u_hasFire;
uniform vec2 u_firePosition;
out vec4 out_color;

const vec4[] timeOfDayTint = vec4[](
    vec4(1),
    vec4(1, 0.75, 0.5, 1),
    vec4(0.5, 0.5, 0.8, 1)
);

const vec4 fade = vec4(0, 0, 0, 1);

void main()
{
    vec4 textureColor = texture(u_texture, v_texcoord);
    vec4 tinted = textureColor * timeOfDayTint[u_timeOfDay];

    if (u_hasFire)
    {
        float x = (v_texcoord.x - u_firePosition.x) * (16.0 / 9.0);
        float y = v_texcoord.y - u_firePosition.y;
        float distance = sqrt(x * x + y * y);

        if (distance < 0.5)
        {
            float falloff = floor((distance * 2.0) * 4.0) / 4.0;
            tinted = mix(textureColor, tinted, falloff);
        }
    }

    out_color = mix(tinted, fade, u_fadeFactor);
}
