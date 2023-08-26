import { mount } from '@vue/test-utils';
import { describe, it, expect } from "vitest";
import ChatLoading from "../loading/ChatLoading.vue";

describe("ChatLoading", () => {
  it("Render correctly", () => {
    const wrapper = mount(ChatLoading);

    expect(wrapper.exists()).toBe(true);

    const divElement = wrapper.find('.chat-loading-container');
    expect(divElement.exists()).toBe(true);
  })
})