<template>
    <transition name="fade">
        <div>
            <div id="bg"></div>
            <div id="container">
                <div class="donut"></div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {};
</script>

<style scoped>
#bg {
    top: 0;
    left: 0;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.4;
    z-index: 1000;
}
@keyframes donut-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.donut {
    display: inline-block;
    display: block;
    border: 6px solid rgba(0, 0, 0, 0.1);
    border-left-color: #fff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: donut-spin 1.2s linear infinite;
}
#container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
