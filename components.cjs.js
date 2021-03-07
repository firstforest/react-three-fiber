'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var WebGLMultisampleRenderTarget = 'webGLMultisampleRenderTarget';
var WebGLCubeRenderTarget = 'webGLCubeRenderTarget';
var WebGLRenderTarget = 'webGLRenderTarget';
var WebGLRenderer = 'webGLRenderer';
var WebGL1Renderer = 'webGL1Renderer';
var FogExp2 = 'fogExp2';
var Fog = 'fog';
var Scene = 'scene';
var Sprite = 'sprite';
var LOD = 'lOD';
var InstancedMesh = 'instancedMesh';
var SkinnedMesh = 'skinnedMesh';
var Skeleton = 'skeleton';
var Bone = 'bone';
var Mesh = 'mesh';
var LineSegments = 'lineSegments';
var LineLoop = 'lineLoop';
var Line = 'line';
var Points = 'points';
var Group = 'group';
var VideoTexture = 'videoTexture';
var DataTexture = 'dataTexture';
var DataTexture3D = 'dataTexture3D';
var CompressedTexture = 'compressedTexture';
var CubeTexture = 'cubeTexture';
var CanvasTexture = 'canvasTexture';
var DepthTexture = 'depthTexture';
var Texture = 'texture';
var WireframeGeometry = 'wireframeGeometry';
var ParametricBufferGeometry = 'parametricBufferGeometry';
var ParametricGeometry = 'parametricGeometry';
var TetrahedronBufferGeometry = 'tetrahedronBufferGeometry';
var TetrahedronGeometry = 'tetrahedronGeometry';
var OctahedronBufferGeometry = 'octahedronBufferGeometry';
var OctahedronGeometry = 'octahedronGeometry';
var IcosahedronBufferGeometry = 'icosahedronBufferGeometry';
var IcosahedronGeometry = 'icosahedronGeometry';
var DodecahedronBufferGeometry = 'dodecahedronBufferGeometry';
var DodecahedronGeometry = 'dodecahedronGeometry';
var PolyhedronBufferGeometry = 'polyhedronBufferGeometry';
var PolyhedronGeometry = 'polyhedronGeometry';
var TubeBufferGeometry = 'tubeBufferGeometry';
var TubeGeometry = 'tubeGeometry';
var TorusKnotBufferGeometry = 'torusKnotBufferGeometry';
var TorusKnotGeometry = 'torusKnotGeometry';
var TorusBufferGeometry = 'torusBufferGeometry';
var TorusGeometry = 'torusGeometry';
var TextBufferGeometry = 'textBufferGeometry';
var TextGeometry = 'textGeometry';
var SphereBufferGeometry = 'sphereBufferGeometry';
var SphereGeometry = 'sphereGeometry';
var RingBufferGeometry = 'ringBufferGeometry';
var RingGeometry = 'ringGeometry';
var PlaneBufferGeometry = 'planeBufferGeometry';
var PlaneGeometry = 'planeGeometry';
var LatheBufferGeometry = 'latheBufferGeometry';
var LatheGeometry = 'latheGeometry';
var ShapeBufferGeometry = 'shapeBufferGeometry';
var ShapeGeometry = 'shapeGeometry';
var ExtrudeBufferGeometry = 'extrudeBufferGeometry';
var ExtrudeGeometry = 'extrudeGeometry';
var EdgesGeometry = 'edgesGeometry';
var ConeBufferGeometry = 'coneBufferGeometry';
var ConeGeometry = 'coneGeometry';
var CylinderBufferGeometry = 'cylinderBufferGeometry';
var CylinderGeometry = 'cylinderGeometry';
var CircleBufferGeometry = 'circleBufferGeometry';
var CircleGeometry = 'circleGeometry';
var BoxBufferGeometry = 'boxBufferGeometry';
var BoxGeometry = 'boxGeometry';
var ShadowMaterial = 'shadowMaterial';
var SpriteMaterial = 'spriteMaterial';
var RawShaderMaterial = 'rawShaderMaterial';
var ShaderMaterial = 'shaderMaterial';
var PointsMaterial = 'pointsMaterial';
var MeshPhysicalMaterial = 'meshPhysicalMaterial';
var MeshStandardMaterial = 'meshStandardMaterial';
var MeshPhongMaterial = 'meshPhongMaterial';
var MeshToonMaterial = 'meshToonMaterial';
var MeshNormalMaterial = 'meshNormalMaterial';
var MeshLambertMaterial = 'meshLambertMaterial';
var MeshDepthMaterial = 'meshDepthMaterial';
var MeshDistanceMaterial = 'meshDistanceMaterial';
var MeshBasicMaterial = 'meshBasicMaterial';
var MeshMatcapMaterial = 'meshMatcapMaterial';
var LineDashedMaterial = 'lineDashedMaterial';
var LineBasicMaterial = 'lineBasicMaterial';
var Material = 'material';
var AnimationLoader = 'animationLoader';
var CompressedTextureLoader = 'compressedTextureLoader';
var DataTextureLoader = 'dataTextureLoader';
var CubeTextureLoader = 'cubeTextureLoader';
var TextureLoader = 'textureLoader';
var ObjectLoader = 'objectLoader';
var MaterialLoader = 'materialLoader';
var BufferGeometryLoader = 'bufferGeometryLoader';
var LoadingManager = 'loadingManager';
var ImageLoader = 'imageLoader';
var ImageBitmapLoader = 'imageBitmapLoader';
var FontLoader = 'fontLoader';
var FileLoader = 'fileLoader';
var Loader = 'loader';
var LoaderUtils = 'loaderUtils';
var AudioLoader = 'audioLoader';
var SpotLightShadow = 'spotLightShadow';
var SpotLight = 'spotLight';
var PointLight = 'pointLight';
var RectAreaLight = 'rectAreaLight';
var HemisphereLight = 'hemisphereLight';
var DirectionalLightShadow = 'directionalLightShadow';
var DirectionalLight = 'directionalLight';
var AmbientLight = 'ambientLight';
var LightShadow = 'lightShadow';
var Light = 'light';
var AmbientLightProbe = 'ambientLightProbe';
var HemisphereLightProbe = 'hemisphereLightProbe';
var LightProbe = 'lightProbe';
var StereoCamera = 'stereoCamera';
var PerspectiveCamera = 'perspectiveCamera';
var OrthographicCamera = 'orthographicCamera';
var CubeCamera = 'cubeCamera';
var ArrayCamera = 'arrayCamera';
var Camera = 'camera';
var AudioListener = 'audioListener';
var PositionalAudio = 'positionalAudio';
var AudioAnalyser = 'audioAnalyser';
var Audio = 'audio';
var VectorKeyframeTrack = 'vectorKeyframeTrack';
var StringKeyframeTrack = 'stringKeyframeTrack';
var QuaternionKeyframeTrack = 'quaternionKeyframeTrack';
var NumberKeyframeTrack = 'numberKeyframeTrack';
var ColorKeyframeTrack = 'colorKeyframeTrack';
var BooleanKeyframeTrack = 'booleanKeyframeTrack';
var PropertyMixer = 'propertyMixer';
var PropertyBinding = 'propertyBinding';
var KeyframeTrack = 'keyframeTrack';
var AnimationObjectGroup = 'animationObjectGroup';
var AnimationMixer = 'animationMixer';
var AnimationClip = 'animationClip';
var AnimationAction = 'animationAction';
var Uniform = 'uniform';
var InstancedBufferGeometry = 'instancedBufferGeometry';
var BufferGeometry = 'bufferGeometry';
var Geometry = 'geometry';
var InterleavedBufferAttribute = 'interleavedBufferAttribute';
var InstancedInterleavedBuffer = 'instancedInterleavedBuffer';
var InterleavedBuffer = 'interleavedBuffer';
var InstancedBufferAttribute = 'instancedBufferAttribute';
var BufferAttribute = 'bufferAttribute';
var Int8Attribute = 'int8Attribute';
var Uint8Attribute = 'uint8Attribute';
var Uint8ClampedAttribute = 'uint8ClampedAttribute';
var Int16Attribute = 'int16Attribute';
var Uint16Attribute = 'uint16Attribute';
var Int32Attribute = 'int32Attribute';
var Uint32Attribute = 'uint32Attribute';
var Float32Attribute = 'float32Attribute';
var Float64Attribute = 'float64Attribute';
var Int8BufferAttribute = 'int8BufferAttribute';
var Uint8BufferAttribute = 'uint8BufferAttribute';
var Uint8ClampedBufferAttribute = 'uint8ClampedBufferAttribute';
var Int16BufferAttribute = 'int16BufferAttribute';
var Uint16BufferAttribute = 'uint16BufferAttribute';
var Int32BufferAttribute = 'int32BufferAttribute';
var Uint32BufferAttribute = 'uint32BufferAttribute';
var Float32BufferAttribute = 'float32BufferAttribute';
var Float64BufferAttribute = 'float64BufferAttribute';
var Face3 = 'face3';
var Object3D = 'object3D';
var Raycaster = 'raycaster';
var Layers = 'layers';
var EventDispatcher = 'eventDispatcher';
var DirectGeometry = 'directGeometry';
var Clock = 'clock';
var QuaternionLinearInterpolant = 'quaternionLinearInterpolant';
var LinearInterpolant = 'linearInterpolant';
var DiscreteInterpolant = 'discreteInterpolant';
var CubicInterpolant = 'cubicInterpolant';
var Triangle = 'triangle';
var Spherical = 'spherical';
var Cylindrical = 'cylindrical';
var Plane = 'plane';
var Frustum = 'frustum';
var Sphere = 'sphere';
var Ray = 'ray';
var Matrix4 = 'matrix4';
var Matrix3 = 'matrix3';
var Box3 = 'box3';
var Box2 = 'box2';
var Line3 = 'line3';
var Euler = 'euler';
var Vector4 = 'vector4';
var Vector3 = 'vector3';
var Vector2 = 'vector2';
var Quaternion = 'quaternion';
var Color = 'color';
var SphericalHarmonics3 = 'sphericalHarmonics3';
var ImmediateRenderObject = 'immediateRenderObject';
var SpotLightHelper = 'spotLightHelper';
var SkeletonHelper = 'skeletonHelper';
var PointLightHelper = 'pointLightHelper';
var HemisphereLightHelper = 'hemisphereLightHelper';
var GridHelper = 'gridHelper';
var PolarGridHelper = 'polarGridHelper';
var DirectionalLightHelper = 'directionalLightHelper';
var CameraHelper = 'cameraHelper';
var BoxHelper = 'boxHelper';
var Box3Helper = 'box3Helper';
var PlaneHelper = 'planeHelper';
var ArrowHelper = 'arrowHelper';
var AxesHelper = 'axesHelper';
var ArcCurve = 'arcCurve';
var CatmullRomCurve3 = 'catmullRomCurve3';
var CubicBezierCurve = 'cubicBezierCurve';
var CubicBezierCurve3 = 'cubicBezierCurve3';
var EllipseCurve = 'ellipseCurve';
var LineCurve = 'lineCurve';
var LineCurve3 = 'lineCurve3';
var QuadraticBezierCurve = 'quadraticBezierCurve';
var QuadraticBezierCurve3 = 'quadraticBezierCurve3';
var SplineCurve = 'splineCurve';
var Shape = 'shape';
var Path = 'path';
var ShapePath = 'shapePath';
var Font = 'font';
var CurvePath = 'curvePath';
var Curve = 'curve';
var PMREMGenerator = 'pMREMGenerator';
var WebGLBufferRenderer = 'webGLBufferRenderer';
var WebGLCapabilities = 'webGLCapabilities';
var WebGLClipping = 'webGLClipping';
var WebGLExtensions = 'webGLExtensions';
var WebGLGeometries = 'webGLGeometries';
var WebGLIndexedBufferRenderer = 'webGLIndexedBufferRenderer';
var WebGLInfo = 'webGLInfo';
var WebGLLights = 'webGLLights';
var WebGLObjects = 'webGLObjects';
var WebGLProgram = 'webGLProgram';
var WebGLPrograms = 'webGLPrograms';
var WebGLProperties = 'webGLProperties';
var WebGLRenderList = 'webGLRenderList';
var WebGLRenderLists = 'webGLRenderLists';
var WebGLShader = 'webGLShader';
var WebGLShadowMap = 'webGLShadowMap';
var WebGLColorBuffer = 'webGLColorBuffer';
var WebGLDepthBuffer = 'webGLDepthBuffer';
var WebGLStencilBuffer = 'webGLStencilBuffer';
var WebGLState = 'webGLState';
var WebGLTextures = 'webGLTextures';
var WebGLUniforms = 'webGLUniforms';
var MultiMaterial = 'multiMaterial';

var Primitive = 'primitive';
var New = 'new';

exports.AmbientLight = AmbientLight;
exports.AmbientLightProbe = AmbientLightProbe;
exports.AnimationAction = AnimationAction;
exports.AnimationClip = AnimationClip;
exports.AnimationLoader = AnimationLoader;
exports.AnimationMixer = AnimationMixer;
exports.AnimationObjectGroup = AnimationObjectGroup;
exports.ArcCurve = ArcCurve;
exports.ArrayCamera = ArrayCamera;
exports.ArrowHelper = ArrowHelper;
exports.Audio = Audio;
exports.AudioAnalyser = AudioAnalyser;
exports.AudioListener = AudioListener;
exports.AudioLoader = AudioLoader;
exports.AxesHelper = AxesHelper;
exports.Bone = Bone;
exports.BooleanKeyframeTrack = BooleanKeyframeTrack;
exports.Box2 = Box2;
exports.Box3 = Box3;
exports.Box3Helper = Box3Helper;
exports.BoxBufferGeometry = BoxBufferGeometry;
exports.BoxGeometry = BoxGeometry;
exports.BoxHelper = BoxHelper;
exports.BufferAttribute = BufferAttribute;
exports.BufferGeometry = BufferGeometry;
exports.BufferGeometryLoader = BufferGeometryLoader;
exports.Camera = Camera;
exports.CameraHelper = CameraHelper;
exports.CanvasTexture = CanvasTexture;
exports.CatmullRomCurve3 = CatmullRomCurve3;
exports.CircleBufferGeometry = CircleBufferGeometry;
exports.CircleGeometry = CircleGeometry;
exports.Clock = Clock;
exports.Color = Color;
exports.ColorKeyframeTrack = ColorKeyframeTrack;
exports.CompressedTexture = CompressedTexture;
exports.CompressedTextureLoader = CompressedTextureLoader;
exports.ConeBufferGeometry = ConeBufferGeometry;
exports.ConeGeometry = ConeGeometry;
exports.CubeCamera = CubeCamera;
exports.CubeTexture = CubeTexture;
exports.CubeTextureLoader = CubeTextureLoader;
exports.CubicBezierCurve = CubicBezierCurve;
exports.CubicBezierCurve3 = CubicBezierCurve3;
exports.CubicInterpolant = CubicInterpolant;
exports.Curve = Curve;
exports.CurvePath = CurvePath;
exports.CylinderBufferGeometry = CylinderBufferGeometry;
exports.CylinderGeometry = CylinderGeometry;
exports.Cylindrical = Cylindrical;
exports.DataTexture = DataTexture;
exports.DataTexture3D = DataTexture3D;
exports.DataTextureLoader = DataTextureLoader;
exports.DepthTexture = DepthTexture;
exports.DirectGeometry = DirectGeometry;
exports.DirectionalLight = DirectionalLight;
exports.DirectionalLightHelper = DirectionalLightHelper;
exports.DirectionalLightShadow = DirectionalLightShadow;
exports.DiscreteInterpolant = DiscreteInterpolant;
exports.DodecahedronBufferGeometry = DodecahedronBufferGeometry;
exports.DodecahedronGeometry = DodecahedronGeometry;
exports.EdgesGeometry = EdgesGeometry;
exports.EllipseCurve = EllipseCurve;
exports.Euler = Euler;
exports.EventDispatcher = EventDispatcher;
exports.ExtrudeBufferGeometry = ExtrudeBufferGeometry;
exports.ExtrudeGeometry = ExtrudeGeometry;
exports.Face3 = Face3;
exports.FileLoader = FileLoader;
exports.Float32Attribute = Float32Attribute;
exports.Float32BufferAttribute = Float32BufferAttribute;
exports.Float64Attribute = Float64Attribute;
exports.Float64BufferAttribute = Float64BufferAttribute;
exports.Fog = Fog;
exports.FogExp2 = FogExp2;
exports.Font = Font;
exports.FontLoader = FontLoader;
exports.Frustum = Frustum;
exports.Geometry = Geometry;
exports.GridHelper = GridHelper;
exports.Group = Group;
exports.HemisphereLight = HemisphereLight;
exports.HemisphereLightHelper = HemisphereLightHelper;
exports.HemisphereLightProbe = HemisphereLightProbe;
exports.IcosahedronBufferGeometry = IcosahedronBufferGeometry;
exports.IcosahedronGeometry = IcosahedronGeometry;
exports.ImageBitmapLoader = ImageBitmapLoader;
exports.ImageLoader = ImageLoader;
exports.ImmediateRenderObject = ImmediateRenderObject;
exports.InstancedBufferAttribute = InstancedBufferAttribute;
exports.InstancedBufferGeometry = InstancedBufferGeometry;
exports.InstancedInterleavedBuffer = InstancedInterleavedBuffer;
exports.InstancedMesh = InstancedMesh;
exports.Int16Attribute = Int16Attribute;
exports.Int16BufferAttribute = Int16BufferAttribute;
exports.Int32Attribute = Int32Attribute;
exports.Int32BufferAttribute = Int32BufferAttribute;
exports.Int8Attribute = Int8Attribute;
exports.Int8BufferAttribute = Int8BufferAttribute;
exports.InterleavedBuffer = InterleavedBuffer;
exports.InterleavedBufferAttribute = InterleavedBufferAttribute;
exports.KeyframeTrack = KeyframeTrack;
exports.LOD = LOD;
exports.LatheBufferGeometry = LatheBufferGeometry;
exports.LatheGeometry = LatheGeometry;
exports.Layers = Layers;
exports.Light = Light;
exports.LightProbe = LightProbe;
exports.LightShadow = LightShadow;
exports.Line = Line;
exports.Line3 = Line3;
exports.LineBasicMaterial = LineBasicMaterial;
exports.LineCurve = LineCurve;
exports.LineCurve3 = LineCurve3;
exports.LineDashedMaterial = LineDashedMaterial;
exports.LineLoop = LineLoop;
exports.LineSegments = LineSegments;
exports.LinearInterpolant = LinearInterpolant;
exports.Loader = Loader;
exports.LoaderUtils = LoaderUtils;
exports.LoadingManager = LoadingManager;
exports.Material = Material;
exports.MaterialLoader = MaterialLoader;
exports.Matrix3 = Matrix3;
exports.Matrix4 = Matrix4;
exports.Mesh = Mesh;
exports.MeshBasicMaterial = MeshBasicMaterial;
exports.MeshDepthMaterial = MeshDepthMaterial;
exports.MeshDistanceMaterial = MeshDistanceMaterial;
exports.MeshLambertMaterial = MeshLambertMaterial;
exports.MeshMatcapMaterial = MeshMatcapMaterial;
exports.MeshNormalMaterial = MeshNormalMaterial;
exports.MeshPhongMaterial = MeshPhongMaterial;
exports.MeshPhysicalMaterial = MeshPhysicalMaterial;
exports.MeshStandardMaterial = MeshStandardMaterial;
exports.MeshToonMaterial = MeshToonMaterial;
exports.MultiMaterial = MultiMaterial;
exports.New = New;
exports.NumberKeyframeTrack = NumberKeyframeTrack;
exports.Object3D = Object3D;
exports.ObjectLoader = ObjectLoader;
exports.OctahedronBufferGeometry = OctahedronBufferGeometry;
exports.OctahedronGeometry = OctahedronGeometry;
exports.OrthographicCamera = OrthographicCamera;
exports.PMREMGenerator = PMREMGenerator;
exports.ParametricBufferGeometry = ParametricBufferGeometry;
exports.ParametricGeometry = ParametricGeometry;
exports.Path = Path;
exports.PerspectiveCamera = PerspectiveCamera;
exports.Plane = Plane;
exports.PlaneBufferGeometry = PlaneBufferGeometry;
exports.PlaneGeometry = PlaneGeometry;
exports.PlaneHelper = PlaneHelper;
exports.PointLight = PointLight;
exports.PointLightHelper = PointLightHelper;
exports.Points = Points;
exports.PointsMaterial = PointsMaterial;
exports.PolarGridHelper = PolarGridHelper;
exports.PolyhedronBufferGeometry = PolyhedronBufferGeometry;
exports.PolyhedronGeometry = PolyhedronGeometry;
exports.PositionalAudio = PositionalAudio;
exports.Primitive = Primitive;
exports.PropertyBinding = PropertyBinding;
exports.PropertyMixer = PropertyMixer;
exports.QuadraticBezierCurve = QuadraticBezierCurve;
exports.QuadraticBezierCurve3 = QuadraticBezierCurve3;
exports.Quaternion = Quaternion;
exports.QuaternionKeyframeTrack = QuaternionKeyframeTrack;
exports.QuaternionLinearInterpolant = QuaternionLinearInterpolant;
exports.RawShaderMaterial = RawShaderMaterial;
exports.Ray = Ray;
exports.Raycaster = Raycaster;
exports.RectAreaLight = RectAreaLight;
exports.RingBufferGeometry = RingBufferGeometry;
exports.RingGeometry = RingGeometry;
exports.Scene = Scene;
exports.ShaderMaterial = ShaderMaterial;
exports.ShadowMaterial = ShadowMaterial;
exports.Shape = Shape;
exports.ShapeBufferGeometry = ShapeBufferGeometry;
exports.ShapeGeometry = ShapeGeometry;
exports.ShapePath = ShapePath;
exports.Skeleton = Skeleton;
exports.SkeletonHelper = SkeletonHelper;
exports.SkinnedMesh = SkinnedMesh;
exports.Sphere = Sphere;
exports.SphereBufferGeometry = SphereBufferGeometry;
exports.SphereGeometry = SphereGeometry;
exports.Spherical = Spherical;
exports.SphericalHarmonics3 = SphericalHarmonics3;
exports.SplineCurve = SplineCurve;
exports.SpotLight = SpotLight;
exports.SpotLightHelper = SpotLightHelper;
exports.SpotLightShadow = SpotLightShadow;
exports.Sprite = Sprite;
exports.SpriteMaterial = SpriteMaterial;
exports.StereoCamera = StereoCamera;
exports.StringKeyframeTrack = StringKeyframeTrack;
exports.TetrahedronBufferGeometry = TetrahedronBufferGeometry;
exports.TetrahedronGeometry = TetrahedronGeometry;
exports.TextBufferGeometry = TextBufferGeometry;
exports.TextGeometry = TextGeometry;
exports.Texture = Texture;
exports.TextureLoader = TextureLoader;
exports.TorusBufferGeometry = TorusBufferGeometry;
exports.TorusGeometry = TorusGeometry;
exports.TorusKnotBufferGeometry = TorusKnotBufferGeometry;
exports.TorusKnotGeometry = TorusKnotGeometry;
exports.Triangle = Triangle;
exports.TubeBufferGeometry = TubeBufferGeometry;
exports.TubeGeometry = TubeGeometry;
exports.Uint16Attribute = Uint16Attribute;
exports.Uint16BufferAttribute = Uint16BufferAttribute;
exports.Uint32Attribute = Uint32Attribute;
exports.Uint32BufferAttribute = Uint32BufferAttribute;
exports.Uint8Attribute = Uint8Attribute;
exports.Uint8BufferAttribute = Uint8BufferAttribute;
exports.Uint8ClampedAttribute = Uint8ClampedAttribute;
exports.Uint8ClampedBufferAttribute = Uint8ClampedBufferAttribute;
exports.Uniform = Uniform;
exports.Vector2 = Vector2;
exports.Vector3 = Vector3;
exports.Vector4 = Vector4;
exports.VectorKeyframeTrack = VectorKeyframeTrack;
exports.VideoTexture = VideoTexture;
exports.WebGL1Renderer = WebGL1Renderer;
exports.WebGLBufferRenderer = WebGLBufferRenderer;
exports.WebGLCapabilities = WebGLCapabilities;
exports.WebGLClipping = WebGLClipping;
exports.WebGLColorBuffer = WebGLColorBuffer;
exports.WebGLCubeRenderTarget = WebGLCubeRenderTarget;
exports.WebGLDepthBuffer = WebGLDepthBuffer;
exports.WebGLExtensions = WebGLExtensions;
exports.WebGLGeometries = WebGLGeometries;
exports.WebGLIndexedBufferRenderer = WebGLIndexedBufferRenderer;
exports.WebGLInfo = WebGLInfo;
exports.WebGLLights = WebGLLights;
exports.WebGLMultisampleRenderTarget = WebGLMultisampleRenderTarget;
exports.WebGLObjects = WebGLObjects;
exports.WebGLProgram = WebGLProgram;
exports.WebGLPrograms = WebGLPrograms;
exports.WebGLProperties = WebGLProperties;
exports.WebGLRenderList = WebGLRenderList;
exports.WebGLRenderLists = WebGLRenderLists;
exports.WebGLRenderTarget = WebGLRenderTarget;
exports.WebGLRenderer = WebGLRenderer;
exports.WebGLShader = WebGLShader;
exports.WebGLShadowMap = WebGLShadowMap;
exports.WebGLState = WebGLState;
exports.WebGLStencilBuffer = WebGLStencilBuffer;
exports.WebGLTextures = WebGLTextures;
exports.WebGLUniforms = WebGLUniforms;
exports.WireframeGeometry = WireframeGeometry;
