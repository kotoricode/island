#version 300 es

out vec2 v_texcoord;

const vec4[] pos = vec4[](
    vec4(-1, -1, 0, 1),
    vec4(1, -1, 0, 1),
    vec4(-1, 1, 0, 1),
    vec4(1, 1, 0, 1)
);

const vec2[] uv = vec2[](
    vec2(0, 0),
    vec2(1, 0),
    vec2(0, 1),
    vec2(1, 1)
);

void main()
{
    gl_Position = pos[gl_VertexID];
    v_texcoord = uv[gl_VertexID];
}
