/** @type{HTMLDivElement} */
let gElementBox

/** @type{HTMLButtonElement} */
let gHintButton

/** @type{HTMLSpanElement} */
let gHintText

/** @type{HTMLInputElement} */
let gAnswerBox

/** @type{HTMLFormElement} */
let gAnswerForm

/** @type{HTMLHeadingElement} */
let gScoreText

/** @type{HTMLHeadingElement} */
let gRemainText

/** @type{HTMLButtonElement} */
let gSkipBtn

/** @type{HTMLHeadingElement} */
let gFlashText

/** @type{{
    symbol: string,
    name: string,
    atomic_num: number
}[]} */
let gTable

/** @type{{
    symbol: string,
    name: string,
    atomic_num: number
}} */
let gCurrentElement

let gHasHint = false
let gScore = 0

/**
 * Picks a random integer between min (inclusive) and max (exclusive)
 * @param {number} min lower bound (inclusive)
 * @param {number} max upper bound (exclusive)
 * @returns {number}
 */
function E_randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Picks a random element from an array
 * @param {ArrayLike} arr 
 * @returns {any}
 */
function E_randomOf(arr) {
    const i = E_randint(0, arr.length)
    return arr[i]
}

window.onload = function(e) {
    console.log("window.onload!")

    gElementBox = document.querySelector(".element-box")
    gHintButton = document.querySelector(".hint-btn")
    gHintText = document.querySelector(".hint-text")
    gAnswerBox = document.querySelector(".answer-box")
    gAnswerForm = document.querySelector(".answer-form")
    gScoreText = document.querySelector(".score-text")
    gRemainText = document.querySelector(".remain-text")
    gSkipBtn = document.querySelector(".skip-btn")
    gFlashText = document.querySelector(".flash-text")

    gHintButton.onclick = function() {
        if(confirm("Are you sure you want a hint?")) {
            console.log("showing hint...")
            E_showHint()
        }
    }

    gAnswerForm.onsubmit = function(e) {
        e.preventDefault()
        console.log("check answer...")
        E_checkCorrect()
    }

    gSkipBtn.onclick = function() {
        console.log("skip!")

        if(gScore > 0) {
            gScore -= 1
        }

        if(gScore < 0) {
            gScore = 0
        }

        E_refreshGame()
    }

    fetch("data.json").then(res => {
        res.json().then(json => {
            gTable = json
            console.log("loaded table!")
            E_refreshGame()
        }).catch(ex => {
            console.error("Failed to parse table!", ex)
        })
    }).catch(ex => {
        console.error("Failed to request table!", ex)
    })
}

/**
 * Refreshes the game state and picks a new element
 */
function E_refreshGame() {
    console.log("refreshing!")

    if(gTable.length < 1) {
        E_flashText("You win!", 10)
        return
    }

    gHasHint = false
    gCurrentElement = E_randomOf(gTable)
    console.log("EL: " + gCurrentElement.name)

    gElementBox.innerText = gCurrentElement.symbol
    gAnswerBox.value = ""
    gHintText.innerText = ""

    gScoreText.innerText = `Score: ${gScore}`
    gRemainText.innerText = `${gTable.length} remaining...`
}

/**
 * Displays part of the name to the player
 */
function E_showHint() {
    gHintText.innerText = gCurrentElement.name.charAt(0)
    
    let charCount = Math.max(1, Math.floor(gCurrentElement.name.length / 4))
    for(let i = 0; i < charCount; i++) {
        gHintText.innerText += gCurrentElement.name.charAt(i + 1)
    }

    let hintSize = gHintText.innerText.length
    for(let i = 0; i < gCurrentElement.name.length - hintSize; i++) {
        gHintText.innerText += "?"
    }

    gHasHint = true
}

/**
 * Checks if the provided guess is correct
 */
function E_checkCorrect() {
    let guess = gAnswerBox.value
    guess = guess.trim().toLowerCase()

    if(guess.length < 1) return

    if(guess == gCurrentElement.name.toLowerCase()) {
        console.log("correct")
        E_flashText("Correct!", 1)

        if(gHasHint) {
            gScore += 0.5
        } else {
            gScore += 1
        }

        gTable = gTable.filter(el => el.name !== gCurrentElement.name)
        console.log("size:", gTable.length)

        E_refreshGame()
    } else {
        console.log("bad")
        gAnswerBox.value = ""
    }
}

/** Shows a temporary message on the screen */
function E_flashText(str, seconds) {
    gFlashText.innerText = str
    setTimeout(() => {
        gFlashText.innerText = ""
    }, seconds * 1000)
}
