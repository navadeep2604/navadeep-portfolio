// Responsive Three.js binary globe with basic performance consideration
(function(){
  const canvas = document.getElementById('globe-canvas');
  const fallback = document.getElementById('globe-fallback');
  if(!canvas) return;

  // Resize helper
  function fitCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  fitCanvas();
  window.addEventListener('resize', fitCanvas);

  // Try WebGL/Three
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias:true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Points sphere
    const radius = Math.min(canvas.width, canvas.height) * 0.18;
    const geometry = new THREE.SphereGeometry(1.6, 64, 64);

    // Create a particle texture via canvas with 1s and 0s
    const txt = document.createElement('canvas');
    txt.width = 1024; txt.height = 512;
    const ctx = txt.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,txt.width,txt.height);
    ctx.fillStyle = '#fff'; ctx.font = '16px monospace';
    for(let i=0;i<2500;i++){
      ctx.fillText(Math.random()>0.5?'1':'0', Math.random()*txt.width, Math.random()*txt.height);
    }
    const texture = new THREE.CanvasTexture(txt);

    const mat = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, mat);
    scene.add(sphere);

    camera.position.z = 4;

    // subtle ambient glow using mesh with additive blending
    const glowGeo = new THREE.SphereGeometry(1.9, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x222233, transparent:true, opacity:0.08 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // Animation loop with FPS cap for mobile
    let last = 0;
    function animate(t){
      requestAnimationFrame(animate);
      const elapsed = t - last;
      // cap update on low-power devices
      const cap = (window.innerWidth < 800) ? 30 : 60;
      if(elapsed < 1000 / cap) return;
      last = t;
      sphere.rotation.y += 0.002;
      // parallax translate based on scroll
      const sc = window.scrollY || window.pageYOffset;
      const shift = (sc / document.body.scrollHeight) * 60; // small effect
      canvas.style.transform = `translateY(${shift}px)`;
      renderer.render(scene, camera);
    }
    animate(0);

  } catch(e) {
    // fallback: show static image if WebGL fails
    canvas.style.display='none';
    if(fallback) fallback.style.display='block';
    console.warn('WebGL failed, fallback image used.', e);
  }
})();