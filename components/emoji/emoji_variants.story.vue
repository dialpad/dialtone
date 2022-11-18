<template>
  <div>
    <div>
      <dt-emoji
        id="emoji-size100"
        code=":smile:"
        size="100"
      />
      <label for="emoji-size100">size 100</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size200"
        code=":smile:"
        size="200"
      />
      <label for="emoji-size200">size 200</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size300"
        code=":smile:"
        size="300"
      />
      <label for="emoji-size300">size 300</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size400"
        code=":smile:"
        size="400"
      />
      <label for="emoji-size400">size 400</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size500"
        code=":smile:"
        size="500"
      />
      <label for="emoji-size500">size 500</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size600"
        code=":smile:"
        size="600"
      />
      <label for="emoji-size600">size 600</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size700"
        code=":smile:"
        size="700"
      />
      <label for="emoji-size700">size 700</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size800"
        code=":smile:"
        size="800"
      />
      <label for="emoji-size800">size 800</label>
    </div>
  </div>
</template>

<script>
import DtEmoji from './emoji';

export default {
  name: 'DtEmojiDefault',
  components: { DtEmoji },
};
</script>
