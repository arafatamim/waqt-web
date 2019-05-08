<template>
    <div>
        <div id="bg" @click="$emit('closeWithoutSaving')"></div>
        <div id="settingsBox">
            <div id="divSettingsHeader">
                <div id="settingsText">Settings</div>
                <font-awesome-icon
                    icon="save"
                    id="closeIcon"
                    class="iconButton"
                    @click="closeAndUpdate()"
                />
            </div>
            <div id="divSettingsContent">
                <div class="control2">
                    Time format
                    <select id="cmbFormat" v-model="parameters.timeFormat">
                        <option value="h:mm A">12-hour</option>
                        <option value="H:mm">24-hour</option>
                    </select>
                </div>
                <div id="localTime">Local Time: {{ localtime }}</div>
                <div id="timezone">Timezone: {{ timezone }}</div>
                <div id="aboutInfo">
                    An app to display current prayer times for the selected location.
                    <br />Made with ♥️ by Tamim Arafat.
                    <br />
                    <a
                        href="http://github.com/arafatamim/waqt-web"
                        target="_blank"
                        class="aboutLink"
                    >
                        <font-awesome-icon :icon="['fab', 'github']" />&nbsp;Source on GitHub
                    </a>
                    <br />
                    <br />
                    <a href="https://ko-fi.com/Q5Q1TLM1" target="_blank">
                        <img
                            height="36"
                            style="border:0px;height:36px;"
                            src="../assets/kofi3.png"
                            border="0"
                            alt="Buy Me a Coffee at ko-fi.com"
                        />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['tformat', 'localtime', 'timezone'],
    data() {
        return {
            parameters: {
                timeFormat: this.tformat
            }
        };
    },
    methods: {
        closeAndUpdate(parameters) {
            this.$emit('updateParameters', this.parameters);
        },
        windowKeyDown(event) {
            if (event.key === 'Escape') {
                this.$emit('closeWithoutSaving');
            }
        },
        created() {
            window.addEventListener('keydown', this.windowKeyDown);
        },
        destroyed() {
            window.removeEventListener('keydown', this.windowKeyDown);
        }
    }
};
</script>

<style lang="scss" scoped>
@import 'styles/_base.scss';

#bg {
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.4;
    z-index: 1000;
}
#settingsBox {
    position: fixed;
    width: 30%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: map-get($map: $theme, $key: bg);
    border-radius: 20px;
    box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.4);
    padding: 25px;
    z-index: 1001;
}
#divSettingsHeader {
    font-family: $base-font;
    font-size: 15pt;
    color: map-get($map: $theme, $key: text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
/* width */
::-webkit-scrollbar {
    width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
    @if $ui-theme == 'dark' {
        background-color: darken(map-get($map: $theme, $key: bg), 3%);
    } @else {
        background-color: darken(map-get($map: $theme, $key: bg), 5%);
    }
}

/* Handle */
::-webkit-scrollbar-thumb {
    @if $ui-theme == 'dark' {
        background-color: lighten(map-get($map: $theme, $key: bg), 5%);
    } @else {
        background-color: darken(map-get($map: $theme, $key: bg), 20%);
    }
}

#divSettingsContent {
    font-family: $base-font;
    color: map-get($map: $theme, $key: text);
    position: relative;
    display: grid;
    grid-row-gap: 12px;
    font-size: 11pt;
    #btnAddress {
        width: 221px;
    }
    #cmbFormat {
        width: 221px;
    }
    .control1,
    .control2,
    .control3 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    #aboutInfo {
        @if $ui-theme == 'dark' {
            color: darken(map-get($map: $theme, $key: text), 25%);
        } @else {
            color: lighten(map-get($map: $theme, $key: text), 15%);
        }
    }
    .aboutLink {
        margin-top: 2px;
        @if $ui-theme == 'dark' {
            color: darken(map-get($map: $theme, $key: text), 15%);
        } @else {
            color: lighten(map-get($map: $theme, $key: text), 15%);
        }
        text-decoration: none;
        &:hover {
            color: lighten(map-get($map: $theme, $key: text), 35%);
        }
    }
}
@media (max-width: 768px) {
    #settingsBox {
        width: 60%;
    }
}
@media (max-width: 825px) {
    #settingsBox {
        width: 60%;
    }
}
@media (max-width: 1024px) {
    #settingsBox {
        width: 50%;
    }
}
@media (max-width: 575px) {
    #settingsBox {
        width: 90%;
        border-radius: 0;
    }
}
@media (max-width: 640px) {
    #settingsBox {
        border-radius: 0;
    }
}
</style>
