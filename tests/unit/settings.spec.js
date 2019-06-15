import { mount } from '@vue/test-utils';
import Settings from '@/components/Settings.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

library.add(faSave, faGithub);

describe('Settings.vue', () => {
  const wrapper = mount(Settings, {
    components: {
      FontAwesomeIcon
    },
    attachToDocument: true
  });
  it('emits event when esc is pressed', () => {
    wrapper.trigger('keydown.esc');
    expect(wrapper.emitted('closeWithoutSaving')).toBeTruthy();
  });
  it('emits event when bg is clicked', () => {
    const bg = wrapper.find('#bg');
    bg.trigger('click');
    expect(wrapper.emitted('closeWithoutSaving')).toBeTruthy();
  });
});
