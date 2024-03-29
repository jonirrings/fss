type Program = WebGLProgram & {
    code: string;
    attributes: Attributes;
    uniforms: Uniforms;
}
type Attributes = {
    side: AttrBuffer;
    position: AttrBuffer;
    centroid: AttrBuffer;
    normal: AttrBuffer;
    ambient: AttrBuffer;
    diffuse: AttrBuffer;
}
type AttrBuffer = {
    buffer: WebGLBuffer;
    location?: WebGLUniformLocation | number,
    structure: BufferStruct;
    data?: Float32Array;
    size: number;
}
type BufferStruct = '3f' | '3fv' | '4fv' | 'v3' | 'v4' | 'f';
type Uniforms = {
    resolution: AttrBuffer;
    lightPosition: AttrBuffer;
    lightAmbient: AttrBuffer;
    lightDiffuse: AttrBuffer;
}

class WebGLRenderer extends Renderer {
    element: HTMLCanvasElement;
    vertices: number;
    lights: number;
    gl: WebGLRenderingContext;
    unsupported: boolean;
    program: Program | undefined;

    constructor() {
        super();
        this.element = document.createElement('canvas');
        this.element.style.display = 'block';

        // Set initial vertex and light count
        this.vertices = 0;
        this.lights = 0;
        // Create parameters object
        const parameters = {
            preserveDrawingBuffer: false,
            premultipliedAlpha: true,
            antialias: true,
            stencil: true,
            alpha: true
        };

        // Create and configure the gl context
        this.gl = this.element.getContext('webgl', parameters) as WebGLRenderingContext;

        // Set the internal support flag
        this.unsupported = !this.gl;

        // Setup renderer
        if (this.unsupported) {
            throw 'WebGL is not supported by your browser.';
        } else {
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.setSize(this.element.width, this.element.height);
        }
    }

    setSize(width: number, height: number) {
        super.setSize(width, height);
        if (this.unsupported) return;

        // Set the size of the canvas element
        this.element.width = width;
        this.element.height = height;

        // Set the size of the gl viewport
        this.gl.viewport(0, 0, width, height);
        return this;
    }

    clear() {
        super.clear();
        if (this.unsupported) return this;
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        return this;
    }

    render(scene: Scene) {
        super.render(scene);
        if (this.unsupported) return this;
        let m, mesh: Mesh, t, tl, triangle: Triangle, l, light: Light,
            attribute, uniform, buffer: AttrBuffer, data, location,
            update = false, lights = scene.lights.length,
            index, v, vl, vertex, vertices = 0;

        // Clear context
        this.clear();

        // Build the shader program
        if (this.lights !== lights) {
            this.lights = lights;
            if (this.lights > 0) {
                this.buildProgram(lights);
            } else {
                return this;
            }
        }

        // Update program
        if (!!this.program) {

            // Increment vertex counter
            for (m = scene.meshes.length - 1; m >= 0; m--) {
                mesh = scene.meshes[m];
                if (mesh.geometry.dirty) update = true;
                mesh.update(scene.lights, false);
                vertices += mesh.geometry.triangles.length * 3;
            }

            // Compare vertex counter
            if (update || this.vertices !== vertices) {
                this.vertices = vertices;

                // Build buffers
                for (attribute in this.program.attributes) {
                    buffer = this.program.attributes[attribute as keyof Attributes];
                    buffer.data = new Float32Array(vertices * buffer.size);

                    // Reset vertex index
                    index = 0;

                    // Update attribute buffer data
                    for (m = scene.meshes.length - 1; m >= 0; m--) {
                        mesh = scene.meshes[m];

                        for (t = 0, tl = mesh.geometry.triangles.length; t < tl; t++) {
                            triangle = mesh.geometry.triangles[t];

                            for (v = 0, vl = triangle.vertices.length; v < vl; v++) {
                                vertex = triangle.vertices[v];
                                switch (attribute) {
                                    case 'side':
                                        this.setBufferData(index, buffer, mesh.side as number);
                                        break;
                                    case 'position':
                                        this.setBufferData(index, buffer, vertex.position.toArray());
                                        break;
                                    case 'centroid':
                                        this.setBufferData(index, buffer, triangle.centroid.toArray());
                                        break;
                                    case 'normal':
                                        this.setBufferData(index, buffer, triangle.normal.toArray());
                                        break;
                                    case 'ambient':
                                        this.setBufferData(index, buffer, mesh.material.ambient.rgba.toArray());
                                        break;
                                    case 'diffuse':
                                        this.setBufferData(index, buffer, mesh.material.diffuse.rgba.toArray());
                                        break;
                                }
                                index++;
                            }
                        }
                    }

                    // Upload attribute buffer data
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer.data, this.gl.DYNAMIC_DRAW);
                    this.gl.enableVertexAttribArray(buffer.location as number);
                    this.gl.vertexAttribPointer(buffer.location as number, buffer.size, this.gl.FLOAT, false, 0, 0);
                }
            }

            // Build uniform buffers
            this.setBufferData(0, this.program.uniforms.resolution, [this.width, this.height, this.width]);
            for (l = lights - 1; l >= 0; l--) {
                light = scene.lights[l];
                this.setBufferData(l, this.program.uniforms.lightPosition, light.position.toArray());
                this.setBufferData(l, this.program.uniforms.lightAmbient, light.ambient.rgba.toArray());
                this.setBufferData(l, this.program.uniforms.lightDiffuse, light.diffuse.rgba.toArray());
            }

            // Update uniforms
            for (uniform in this.program.uniforms) {
                buffer = this.program.uniforms[uniform as keyof Uniforms];
                location = buffer.location!;
                data = buffer.data!;
                switch (buffer.structure) {
                    case '3f':
                        this.gl.uniform3f(location, data[0], data[1], data[2]);
                        break;
                    case '3fv':
                        this.gl.uniform3fv(location, data);
                        break;
                    case '4fv':
                        this.gl.uniform4fv(location, data);
                        break;
                }
            }
        }

        // Draw those lovely triangles
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices);
        return this;
    }

    setBufferData(index: number, buffer: AttrBuffer, value: number | number[]) {
        if (!buffer.data) return;
        if (Array.isArray(value)) {
            for (let i = value.length - 1; i >= 0; i--) {
                buffer.data[index * buffer.size + i] = value[i];
            }
        } else {
            buffer.data[index * buffer.size] = value;
        }
    }

    /**
     * Concepts taken from three.js WebGLRenderer
     * @see https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js
     */
    buildProgram(lights: number) {
        if (this.unsupported) return;

        // Create shader source
        const vs = WebGLRenderer.VS(lights);
        const fs = WebGLRenderer.FS(lights);

        // Derive the shader fingerprint
        const code = vs + fs;

        // Check if the program has already been compiled
        if (!!this.program && this.program.code === code) return;

        // Create the program and shaders
        const program = this.gl.createProgram() as Program;
        const vertexShader = this.buildShader(this.gl.VERTEX_SHADER, vs)!;
        const fragmentShader = this.buildShader(this.gl.FRAGMENT_SHADER, fs)!;

        // Attach an link the shader
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        // Add error handling
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const error = this.gl.getError();
            const status = this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS);
            console.error('Could not initialise shader.\nVALIDATE_STATUS: ' + status + '\nERROR: ' + error);
            return null;
        }

        // Delete the shader
        this.gl.deleteShader(fragmentShader);
        this.gl.deleteShader(vertexShader);

        // Set the program code
        program.code = code;

        // Add the program attributes
        program.attributes = {
            side: this.buildBuffer(program, 'attribute', 'aSide', 1, 'f'),
            position: this.buildBuffer(program, 'attribute', 'aPosition', 3, 'v3'),
            centroid: this.buildBuffer(program, 'attribute', 'aCentroid', 3, 'v3'),
            normal: this.buildBuffer(program, 'attribute', 'aNormal', 3, 'v3'),
            ambient: this.buildBuffer(program, 'attribute', 'aAmbient', 4, 'v4'),
            diffuse: this.buildBuffer(program, 'attribute', 'aDiffuse', 4, 'v4')
        };

        // Add the program uniforms
        program.uniforms = {
            resolution: this.buildBuffer(program, 'uniform', 'uResolution', 3, '3f', 1),
            lightPosition: this.buildBuffer(program, 'uniform', 'uLightPosition', 3, '3fv', lights),
            lightAmbient: this.buildBuffer(program, 'uniform', 'uLightAmbient', 4, '4fv', lights),
            lightDiffuse: this.buildBuffer(program, 'uniform', 'uLightDiffuse', 4, '4fv', lights)
        };

        // Set the renderer program
        this.program = program;

        // Enable program
        this.gl.useProgram(this.program);

        // Return the program
        return program;
    }

    buildShader(type: number, source: string) {
        if (this.unsupported) return;

        // Create and compile shader
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // Add error handling
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            return null;
        }

        // Return the shader
        return shader;
    }

    buildBuffer(program: Program, type: 'attribute' | 'uniform', identifier: string, size: number, structure: BufferStruct, count = 0) {
        const buffer: AttrBuffer = {buffer: this.gl.createBuffer()!, size: size, structure: structure};

        // Set the location
        switch (type) {
            case 'attribute':
                buffer.location = this.gl.getAttribLocation(program, identifier);
                break;
            case 'uniform':
                buffer.location = this.gl.getUniformLocation(program, identifier)!;
                break;
        }

        // Create the buffer if count is provided
        if (!!count) {
            buffer.data = new Float32Array(count * size);
        }

        // Return the buffer
        return buffer;
    }

    static VS(lights: number) {
        const shader = [

            // Precision
            'precision mediump float;',

            // Lights
            '#define LIGHTS ' + lights,

            // Attributes
            'attribute float aSide;',
            'attribute vec3 aPosition;',
            'attribute vec3 aCentroid;',
            'attribute vec3 aNormal;',
            'attribute vec4 aAmbient;',
            'attribute vec4 aDiffuse;',

            // Uniforms
            'uniform vec3 uResolution;',
            'uniform vec3 uLightPosition[LIGHTS];',
            'uniform vec4 uLightAmbient[LIGHTS];',
            'uniform vec4 uLightDiffuse[LIGHTS];',

            // Varyings
            'varying vec4 vColor;',

            // Main
            'void main() {',

            // Create color
            'vColor = vec4(0.0);',

            // Calculate the vertex position
            'vec3 position = aPosition / uResolution * 2.0;',

            // Iterate through lights
            'for (int i = 0; i < LIGHTS; i++) {',
            'vec3 lightPosition = uLightPosition[i];',
            'vec4 lightAmbient = uLightAmbient[i];',
            'vec4 lightDiffuse = uLightDiffuse[i];',

            // Calculate illuminance
            'vec3 ray = normalize(lightPosition - aCentroid);',
            'float illuminance = dot(aNormal, ray);',
            'if (aSide == 0.0) {',
            'illuminance = max(illuminance, 0.0);',
            '} else if (aSide == 1.0) {',
            'illuminance = abs(min(illuminance, 0.0));',
            '} else if (aSide == 2.0) {',
            'illuminance = max(abs(illuminance), 0.0);',
            '}',

            // Calculate ambient light
            'vColor += aAmbient * lightAmbient;',

            // Calculate diffuse light
            'vColor += aDiffuse * lightDiffuse * illuminance;',
            '}',

            // Clamp color
            'vColor = clamp(vColor, 0.0, 1.0);',

            // Set gl_Position
            'gl_Position = vec4(position, 1.0);',

            '}'

            // Return the shader
        ].join('\n');
        return shader;
    }

    static FS(_lights: number) {
        const shader = [

            // Precision
            'precision mediump float;',

            // Varyings
            'varying vec4 vColor;',

            // Main
            'void main() {',

            // Set gl_FragColor
            'gl_FragColor = vColor;',

            '}'

            // Return the shader
        ].join('\n');
        return shader;
    }
}
