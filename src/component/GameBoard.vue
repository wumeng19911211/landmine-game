<template>
  <div class="game-board">
    <div class="game-baord-head">
      <div class="row">
        <div class="bomb-num">总数:{{markBombs.length}}/{{bombNum}}</div>
        <div class="time">耗时(秒):{{time}}</div>
      </div>
      <div class="row">
        <div class="restart-btn">
          <el-button type="primary" icon="el-icon-refresh-right" size="mini" @click="reStart"></el-button>
        </div>
        <div class="choose-difficulty">
            <el-select v-model="currentDiffculty" placeholder="请选择" size="mini">
              <el-option
                v-for="item in difficultyOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
        </div>
      </div>
    </div>
    <div class="game-board-body">
      <table border="1" cellpadding="0" cellspacing="0">
        <tr v-for="(item, index) in boardData" :key="index">
          <td v-for="(item2, index2) in item" :key="index2">
            <div class="grid" @click="showContent(item2)" @contextmenu.prevent="setMarkForBomb(item2)">
              <Bomb v-if="item2.content === 'bomb'"></Bomb>
              <span v-else>{{item2.neighborBombNum > 0 ? item2.neighborBombNum : ''}}</span>
              <GridMask v-if="item2.status === 0">
                <img src="../images/flag.png" alt="" class="flag" v-show="markBombs.includes(item2.id)">
              </GridMask>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getBoardData } from '../utils.js'
import Bomb from './Bomb'
import GridMask from './GridMask'

export default {
    name: 'gameboard',
    components:{
      Bomb,
      GridMask
    },
    data() {
        return {
          boardData:[],
          markBombs: [],
          // bombNum: 10,
          // boardSize: 10,
          time: '00',
          isTiming: false,
          currentDiffculty: '0',
          difficultyOptions: [
            { key: '0', value: '初级', boardSize: 9, bombPercent: 0.12},
            { key: '1', value: '中级', boardSize: 16, bombPercent: 0.15},
            { key: '2', value: '高级', boardSize: 20, bombPercent: 0.2},
          ]
        }
    },
    computed: {
      showContentNum() {
        let showContentNum = 0
        this.boardData.forEach(item => {
          item.forEach(item2 => {
            if(item2.status === 1) {
              showContentNum++
            }
          })
        })
        return showContentNum
      },
      boardConfig() {
        return this.difficultyOptions.find(item => item.key === this.currentDiffculty)
      },
      bombNum() {
        return Math.ceil(this.boardSize * this.boardSize * this.boardConfig.bombPercent)
      },
      boardSize() {
        return this.boardConfig && this.boardConfig.boardSize || 10
      }
    },
    watch: {
      currentDiffculty(val,oldval) {
        this.initBoardData()
      }
    },
    created() {
      this.initBoardData()
    },
    methods:{
      initBoardData() {
        this.boardData = getBoardData(this.boardSize, this.bombNum)
        this.markBombs = []
        this.isTiming = false
      },
      timing(startTime) {
        setTimeout(() => {
          let time = ((new Date() - startTime) / 1000).toFixed(0)
          this.time = time < 10 ? '0' + time : time
          if(this.isTiming) {
            this.timing(startTime)
          }
        }, 1000)
      },
      startTiming() {
        if(this.isTiming) return
        let startTime = new Date()
        this.isTiming = true
        this.timing(startTime)
      },
      showContent(item) {
        if(item.status === 1) return
        item.status = 1
        this.startTiming()
        this.showNeighbors(item)
        if(item.content === 'bomb') {
          this.endGame()
          this.$message.error('Game over!');
          return
        }
        const safeNum = this.boardSize * this.boardSize - this.bombNum
        // console.log('showContentNum :>> ', this.showContentNum);
        // console.log('safeNum :>> ', safeNum);
        if(this.showContentNum >= safeNum) {
          this.endGame()
          this.$message.success('You win!')
        }
      },
      reStart() {
        this.initBoardData()
      },
      endGame() {
        this.markBombs = []
        this.isTiming = false
        this.boardData.forEach(item => {
          item.forEach(item2 => {
            if(item2.status === 0) {
              item2.status = 1
            }
          })
        })
      },
      showNeighbors(item) {
        debugger
        if(item.neighborBombNum !== 0) return
        const neighbors = item.neighbors
        for (const key in neighbors) {
          const element = neighbors[key]
          if(element && element.status === 0 && element.content !== 'bomb') {
            element.status = 1
            this.showNeighbors(element)
          }
        }
      },
      setMarkForBomb(item) {
        if(item.status === 1) return
        const id = item.id
        if(this.markBombs.includes(id)) {
          const index = this.markBombs.indexOf(id)
          this.markBombs.splice(index,1)
        } else {
          this.markBombs.push(id)
        }
      }
    }
}
</script>

<style lang="less">
  .game-board {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .game-baord-head {
      display: flex;
      flex-direction: column;
      width: 100%;
      // height: 40px;
      font-size: 16px;
      border: 2px solid #000;
      box-sizing: border-box;
      .row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        box-sizing: border-box;
        margin: 5px 0;
        .choose-difficulty {
          // width: 80px;
          .el-select {
            width: 80px;
          }
        }
        >div {
          width: 50%;
        }
      }
    }
    table {
      td {
        div.grid {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          position: relative;
          user-select: none;
        }
      }
    }
  }
</style>