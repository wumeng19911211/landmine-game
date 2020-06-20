export const getBoardData = (size = 10, bombNum = 10) => {
    debugger
    const boardData = []
    for (let i = 0; i < size; i++) {
        const rowData = []
        for (let j = 0; j < size; j++) {
            rowData.push({
                id: `${i+1}-${j+1}`,
                content:'',
                neighborBombNum: 0,
                status: 0,
                neighbors: {
                    left:'',
                    leftTop:'',
                    top:'',
                    rightTop:'',
                    right:'',
                    rightBottom:'',
                    bottom:'',
                    leftBottom:''
                }
            })
        }
        boardData.push(rowData)
    }
    setNeighbors(boardData)
    setBombs(boardData,size, bombNum)
    
    return boardData
}
const setNeighbors = (boardData = []) => { // 设置格子之间的相邻关系
    for (let i = 0; i < boardData.length; i++) {
        const rowData = boardData[i]
        for (let j = 0; j < rowData.length; j++) {
            const cell = rowData[j]
            const neighbors = cell.neighbors
            neighbors.left = boardData[i][j-1] || null
            neighbors.leftTop = boardData[i - 1] && boardData[i - 1][j - 1] || null
            neighbors.top = boardData[i - 1] && boardData[i - 1][j] || null
            neighbors.rightTop = boardData[i - 1] && boardData[i - 1][j + 1] || null
            neighbors.right = boardData[i][j + 1] || null
            neighbors.rightBottom = boardData[i + 1] && boardData[i + 1][j + 1] || null
            neighbors.bottom = boardData[i + 1] && boardData[i + 1][j] || null
            neighbors.leftBottom = boardData[i + 1] && boardData[i + 1][j - 1] || null
        }
    }
    return boardData
}
const setBombs = (boardData, size, bombNum,) => { // 埋藏地雷
    debugger
    const bombPositons = getBombPosition(size, bombNum)
    Array.from(bombPositons).forEach(item => {
        const bombPositon = item.split('-')
        const grid = boardData[bombPositon[0] - 1][bombPositon[1] - 1]
        grid.content = 'bomb'
        const neighbors = grid.neighbors
        for (const key in neighbors) {
            neighbors[key] && neighbors[key].neighborBombNum ++
        }
    })
}
const getBombPosition = (size, bombNum) => { // 获取地雷位置
    const bombPositons = new Set()
    while(bombPositons.size < bombNum) {
        let id =  `${getRandom(size)}-${getRandom(size)}`
        if(!bombPositons.has(id)) {
            bombPositons.add(id)
        }
    }
    return bombPositons
}
const getRandom = (size) => {// 获取指定大小的随机数
    return Math.ceil(Math.random() * size)
}
const clearBoard = () => {

}
