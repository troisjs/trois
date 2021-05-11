import { defineComponent, inject, onMounted, onUnmounted, watch } from 'vue'
import { LoadingManager } from 'three'
import { BloomEffect, DepthOfFieldEffect, EdgeDetectionMode, GodRaysEffect, SMAAEffect, SMAAImageLoader, SMAAPreset } from 'postprocessing'
import { EffectPassInjectionKey } from './EffectPass'

// type EffectTypes = 'bloom' | 'dof' | 'godrays' | 'smaa'

export default defineComponent({
  props: {
    type: { type: String, required: true },
    options: { type: Object, default: () => ({}) },
    onReady: Function,
  },
  setup(props) {
    const effectPass = inject(EffectPassInjectionKey)
    if (!effectPass) {
      console.error('EffectPass not found')
      return
    }

    let effect
    const effectIndex = effectPass.getEffectIndex()

    const initEffect = (params) => {
      effect = createEffect(effectPass, props, params)
      if (!effect) {
        console.error('Invalid effect type')
        return
      }
      if (props.onReady) props.onReady(effect)
      effectPass.addEffect(effect, effectIndex)
    }

    onMounted(() => {
      if (props.type === 'smaa') {
        const smaaImageLoader = new SMAAImageLoader(new LoadingManager())
        smaaImageLoader.load(([search, area]) => {
          initEffect({ smaaSearch: search, smaaArea: area })
        })
      } else {
        initEffect()
      }
    })

    onUnmounted(() => {
      if (effect) {
        effectPass.removeEffect(effect)
        effect.dispose()
      }
    })
  },
  render() { return [] },
})

function createEffect(effectPass, props, assets) {
  let effect
  switch (props.type) {
    case 'bloom' :
      effect = createBloomEffect(props)
      break
    case 'dof' :
      effect = createDepthOfFieldEffect(effectPass, props)
      break
    case 'godrays' :
      effect = createGodraysEffect(effectPass, props)
      break
    case 'smaa' :
      effect = createSmaaEffect(props, assets)
      break
  }
  return effect
}

function createBloomEffect(props) {
  const effect = new BloomEffect(props.options)
  watch(() => props.options.luminanceThreshold, (value) => { effect.luminanceMaterial.threshold = value })
  watch(() => props.options.luminanceSmoothing, (value) => { effect.luminanceMaterial.smoothing = value })
  watch(() => props.options.intensity, (value) => { effect.intensity = value })
  return effect
}

function createDepthOfFieldEffect(effectPass, props) {
  const effect = new DepthOfFieldEffect(effectPass.composer.renderer, props.options)
  const uniforms = effect.circleOfConfusionMaterial.uniforms
  watch(() => props.options.focusDistance, (value) => { uniforms.focusDistance.value = value })
  watch(() => props.options.focalLength, (value) => { uniforms.focalLength.value = value })
  watch(() => props.options.bokehScale, (value) => { effect.bokehScale = value })
  return effect
}

function createSmaaEffect(props, assets) {
  const { smaaSearch, smaaArea } = assets
  const params = [props.options.preset ?? SMAAPreset.HIGH, props.options.edgeDetectionMode ?? EdgeDetectionMode.COLOR]
  return new SMAAEffect(smaaSearch, smaaArea, ...params)
}

function createGodraysEffect(effectPass, props) {
  const opts = { ...props.options }
  const { lightSource } = props.options
  if (typeof lightSource !== 'string') {
    console.error('Invalid lightSource')
    return
  }
  delete opts.lightSource

  const lightSourceComp = effectPass.renderer.$root.$refs[lightSource]
  if (!lightSourceComp) {
    console.error('Invalid lightSource ref')
    return
  }

  return new GodRaysEffect(effectPass.composer.renderer.camera, lightSourceComp.mesh, opts)
}
