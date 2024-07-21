#version 300 es

uniform mat4 u_transform;
uniform mat4 u_viewProjection;
uniform mediump vec2 u_uvOffset;
uniform mediump vec2 u_uvSize;
out vec2 v_texcoord;

const vec4[] pos = vec4[](
    vec4(0, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(0, 1, 0, 1),
    vec4(1, 1, 0, 1)
);

const vec2[] uv = vec2[](
    vec2(0, 1),
    vec2(1, 1),
    vec2(0, 0),
    vec2(1, 0)
);

void main()
{
    gl_Position = u_viewProjection * u_transform * pos[gl_VertexID];
    v_texcoord = u_uvSize * uv[gl_VertexID] + u_uvOffset;
}
