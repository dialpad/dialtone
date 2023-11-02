# Dialtone Icons

This is the home for Dialtone icons. It includes the resources needed to implement icons on your application that conform to Dialpad’s design principles and best practices.

## Install Dialtone icons via NPM

To add Dialtone icons into your project, you can install it via NPM:

**For Vue 2 projects:**
```
npm install --save @dialpad/dialtone-icons
```

**For Vue 3 projects:**
```
npm install --save @dialpad/dialtone-icons@vue3
```

Once installed, you can import icons like:
```
import { Accessibility } from '@dialpad/dialtone-icons';
```

## Committing

If you need to add icons, follow the next steps to get your icons committed.

1. Place the `.svg` files into `src/svg` inside the category folder.
2. Run `npm run build`
3. Commit and push your changes.
4. `git cherry-pick` your commit(s) (not release commit) to `vue3`.

## Questions?

If you have a question, please feel free to [open an issue](https://github.com/dialpad/dialtone-icons/issues/new).
