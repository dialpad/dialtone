# Known Issues

* Nested arrays and object controls will eventually run out of space.
* Components that elevate to the highest level in dom can't be contained in the
renderer such as 'DtBanner'. I think storybook uses an i-frame to resolve this issue.
* Similarly, components that take focus and don't have close implemented will lock the
entire site such as 'DtModal'.
* 'DtSkeleton' animation doesn't seem to work
* Code editor copy button doesn't work perfectly anymore with the new indentation system
since flexbox and different containers are used.
* A lot of components don't have any documentation generated for them such as 'DtRootLayout'
preventing them from being supported even though they likely would be. They just need to be
added to 'build_docs.js in dialtone-vue.
* A lot of components are missing the `@values` tags such as 'DtLink' `kind` prop.
  * Not just DtLink, a lot should be added
* The `placeholder` attribute on 'DtInput' should be of type {string}, not {boolean}