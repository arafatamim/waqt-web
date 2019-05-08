<template>
    <transition name="slide">
        <div class="errorBanner">
            <span>
                <font-awesome-icon id="icon" icon="times-circle" />
                <span class="bannerText">Something went wrong</span>
            </span>
            <span id="btnReloadbg" @click="$emit('reloadTimes')">
                <font-awesome-icon icon="redo"></font-awesome-icon>
            </span>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'snackbar'
};
</script>
<style lang="scss" scoped>
@import 'styles/_base.scss';

.errorBanner {
    background-color: #ff1c1c;
    font-family: 'Poppins', sans-serif;
    color: white;
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100vw;
    max-width: 100%;
    padding: 10px 15px;
    box-shadow: 0px -7px 50px rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    box-sizing: border-box;
}

#icon {
    margin-right: 10px;
}

#btnReloadbg {
    display: inline-block;
    background-color: #cc1919;
    padding: 5px;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
}
#btnReloadbg:active {
    background-color: #b61515;
}
.slide-enter-active {
    transition: transform 0.3s ease;
}
.slide-leave-active {
    transition: transform 0.5s ease;
}
.slide-leave-to {
    transform: translateY(100px);
}
.slide-enter {
    transform: translateY(100px);
}
</style>
