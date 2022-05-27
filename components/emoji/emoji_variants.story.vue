<template>
  <div>
    <div>
      <dt-emoji
        id="emoji-size14"
        code=":smile:"
        size="d-svg--size14"
      />
      <label for="emoji-size14">d-svg--size14</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size16"
        code=":smile:"
        size="d-svg--size16"
      />
      <label for="emoji-size16">d-svg--size16</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size18"
        code=":smile:"
        size="d-svg--size18"
      />
      <label for="emoji-size18">d-svg--size18</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size20"
        code=":smile:"
        size="d-svg--size20"
      />
      <label for="emoji-size20">d-svg--size20</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size24"
        code=":smile:"
        size="d-svg--size24"
      />
      <label for="emoji-size24">d-svg--size24</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size32"
        code=":smile:"
        size="d-svg--size32"
      />
      <label for="emoji-size32">d-svg--size32</label>
    </div>
    <div>
      <dt-emoji
        id="emoji-size48"
        code=":smile:"
        size="d-svg--size48"
      />
      <label for="emoji-size48">d-svg--size48</label>
    </div>
    <div>
      <div class="d-w264 d-h264 d-ba">
        <dt-emoji
          id="emoji-size100p"
          code=":smile:"
          size="d-svg--size100p"
        />
      </div>
      <label for="emoji-size100p">d-svg--size100p, will take the size of the container it's in</label>
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
