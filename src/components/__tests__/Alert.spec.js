import { mount } from '@vue/test-utils';
import { describe, it, expect } from "vitest";
import Alert from "../library/Alert.vue";

const wrapper = mount(Alert, {
  props: {
    alertData: {
      close: true,
      definition: "success",
      message: "alert context"
    }
  }
});

describe("Alert", () => {
  it("Exist component", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain('alert context');
  })
});

describe("Alert Close Option", () => {
  it("Show close classes", () => {

    const alertDismissible = wrapper.find('.alert-dismissible');
    expect(alertDismissible.exists()).toBe(true);

    const fadeClass = wrapper.find('.fade');
    expect(fadeClass.exists()).toBe(true);

    const showClass = wrapper.find('.show');
    expect(showClass.exists()).toBe(true);
  });

  it("Show close button element", () => {
    expect(wrapper.html()).toContain('<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>')
  });
});

describe("Show Icons", () => {
  it("Get url icon", () => {
    expect(wrapper.html()).toContain('/icons/check-circle-solid-24.png');
  });

  it("Get alt description", () => {
    expect(wrapper.html()).toContain('alt="success"');
  });
});