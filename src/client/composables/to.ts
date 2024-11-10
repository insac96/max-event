export const useTo = () => {
  const navigateToSSL = (path : string) => {
    const runtimeConfig = useRuntimeConfig()
    const route = useRequestURL()

    if(!!runtimeConfig.public.dev) return navigateTo(path)

    if(route.protocol == 'https:'){
      return navigateTo(path)
    }
    else {
      return navigateTo(`https://${runtimeConfig.public.domain}${path}`, { external: true })
    }
  }

  const openNewTab = (url : string) => {
    const { isSafari } = useDevice()
    if(!!isSafari)(
      location.href = url
    )
    else {
      navigateTo(url, { open: { target: '_blank'}})
    }
  }

  return { navigateToSSL, openNewTab }
}