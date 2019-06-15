import { shallowMount } from '@vue/test-utils';
import Timebox from '@/components/Timebox.vue';

describe('Timebox.vue, when activeWaqt prop is passed', () => {
  const wrapper = shallowMount(Timebox, {
    propsData: { activeWaqt: true }
  });
  it('has class active', () => {
    const contentBox = wrapper.find('.contentBox');
    expect(contentBox.classes()).toContain('active');
  });
  it('displays remaining time', () => {
    const nextWaqtTime = wrapper.find('.nextWaqtTime');
    expect(nextWaqtTime.exists()).toBe(true);
  });
});
