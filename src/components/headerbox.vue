<template>
    <div id="headerBox">
        <div id="headerText">Waqt Web</div>
        <font-awesome-icon id='headerSettings' icon="cog" @click="$emit('showDialog')"/>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "styles/_base.scss";

#headerBox {
    font-family: $base-font;
    color: #eee;
    padding: 20px;
    font-size: 20pt;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    #headerSettings {
        cursor: pointer;
    }
    #headerSettings:hover {
        color: #fff;
    }
}
</style>
