<!-- <script lang="ts">
  import Particles from "svelte-particles";
  import { loadFull } from "tsparticles";

  let particlesConfig = {
    particles: {
      angle: {
        value: 0,
        offset: 30,
      },
      move: {
        enable: true,
        outModes: {
          top: "none",
          default: "destroy",
        },
        gravity: {
          enable: true,
        },
        speed: { min: 5, max: 20 },
        decay: 0.01,
      },
      number: {
        value: 0,
        limit: 300,
      },
      opacity: {
        value: 1,
      },
      shape: {
        type: ["circle", "square", "triangle"],
      },
      
      
      
      
    },
  };

  let onParticlesLoaded = (event: any) => {
    const particlesContainer = event.detail.particles;
  };

  let particlesInit = async (engine: any) => {
    await loadFull(engine);
  };
</script>

<Particles
  id="tsparticles"
  options={particlesConfig}
  on:particlesLoaded={onParticlesLoaded}
  {particlesInit}
  class="-z-10"
/> -->
