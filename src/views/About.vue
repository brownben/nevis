<template>
  <main>
    <h1 class="mx-10 mb-1"><back-arrow />About</h1>
    <div class="shadow mx-12 mb-3 px-3 pt-2 pb-1">
      <h2 class="pb-1">System</h2>
      <p>Nevis Version: {{ $electron.remote.app.getVersion() }}</p>
      <p>System: {{ system }}</p>
      <p>Node Version: {{ node }}</p>
      <p>Chrome Version: {{ chromium }}</p>
      <p>Electron Version: {{ electron }}</p>
    </div>
    <div class="shadow mx-12 mb-3 px-3 pt-2 pb-1">
      <h2 class="pb-1">License</h2>
      <h3 class="pb-1">MIT License</h3>
      <p>Copyright (c) 2019 Ben Brown</p>
      <p class="pb-1">
        Permission is hereby granted, free of charge, to any person obtaining a
        copy of this software and associated documentation files (the"
        Software"), to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software, and to
        permit persons to whom the Software is furnished to do so, subject to
        the following conditions: The above copyright notice and this permission
        notice shall be included in all copies or substantial portions of the
        Software.
      </p>
      <p class="pb-1">
        THE SOFTWARE IS PROVIDED"AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
    </div>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'

export default {
  components: {
    'back-arrow': BackArrow,
  },

  data: () => ({
    electron: window.process.versions.electron,
    chromium: window.process.versions.chrome,
    node: window.process.versions.node,
  }),

  computed: {
    system: () => `${window.process.platform} ${window.process.arch}`,
  },
}
</script>
