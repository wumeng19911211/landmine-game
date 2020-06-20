<template>
    <div>
        <h1>{{name}}</h1>
        <game-board></game-board>
    </div>
</template>
<script>
import GameBoard from './component/GameBoard'
export default {
    name: 'app',
    components:{
        GameBoard
    },
    data() {
        return {
            name: '扫雷'
        }
    }
}
</script>

<style>

</style>