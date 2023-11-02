import { mount } from '@vue/test-utils';
import { describe, it, expect } from "vitest";
import ImageLoading from "../loading/ImageLoading.vue";

describe("ImageLoading", () => {
  it("Render correctly", () => {
    const wrapper = mount(ImageLoading);

    expect(wrapper.exists()).toBe(true);

    const divElement = wrapper.find('#ring-loading-container');
    expect(divElement.exists()).toBe(true);
  })
})