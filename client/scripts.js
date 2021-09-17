window.addEventListener('DOMContentLoaded', (event) => {

  /* ****************************************** */
  /* Socket.io ******************************** */


  let deskHeight = 0;

  var socket = io();
  socket.on('connect', function() {
    console.log('socket connected')
  });

  socket.on('laser', function(msg) {
    console.log(msg)
    setNewDeskHeight(msg)
  });

  socket.on('memory:got', ({ button, height }) => {
    console.log(button, height)
    if(height) {
      displayNumberForWhile(height)
    }
  });

  const motor = (where) => {
    socket.emit('motor', where);
  }




  /* ****************************************** */
  /* Switching textures - just for debugging ** */

  let options;

  fetch('textures')
    .then(response => response.json())
    .then(data => {
      if(data.length > 0) document.querySelector(".backgrounds").classList.remove("hidden")

//   ["1","2","3","4"].forEach( function(item) {
//     const optionObj = document.createElement("option");
//     optionObj.textContent = item;
//     document.getElementById("myselect").appendChild(optionObj);
//  });

      options = data
      for(m = 0 ; m <= options.length-1; m++) {
        var opt= document.createElement("OPTION");
        opt.text = options[m];
        opt.value = (m+1);
        if(options[m] == "5"){
          opt.selected = true;
        }

        document.getElementById("selectBG").options.add(opt);

        const opt2 = opt.cloneNode(true);
        document.getElementById("selectBAR").options.add(opt2);
      }
    });

  const backgrounds = document.getElementById("selectBG")
  backgrounds.addEventListener("change", function() {
    const relativePath = options[this.value-1]
    console.log(relativePath)
    document.body.style.backgroundImage = `url('textures/${relativePath}')`;
  });

  const bars = document.getElementById("selectBAR")
  bars.addEventListener("change", function() {
    const relativePath = options[this.value-1]
    console.log(relativePath)
    document.querySelector('.desk-bar').style.backgroundImage = `url('textures/${relativePath}')`;
  });


  /* ****************************************** */
  /* Number digit ***************************** */

  // let number = 0;
  // const animuj = () => {
  //   displayNumber(number);
  //   number += 1;
  // }
  // let idInterwalu = window.setInterval(animuj, 500);

  const displayNumber = (number) => {
    const digits = document.querySelector(".display").children

    number = number.toString()
    while (number.length < 3) number = "0" + number

    const chars = number.split("")

    for (let i = 0; i < chars.length; i++) {
      digits[i].className = ""
      digits[i].classList.add("digit-" + chars[i])
    }
  }

  const displayNumberForWhile = (number, time = 3) => {
    displayNumber(number)
    setTimeout(() => { displayNumber(deskHeight) }, time * 1000)
  }

  const setNewDeskHeight = (height) => {
    deskHeight = height
    displayNumber(deskHeight)
  }


  /* ****************************************** */
  /* Memory & position buttons **************** */

  const actionsForMemoryButtons = () => {
    const buttonGropups = document.querySelectorAll(".button-group__constant");

    buttonGropups.forEach((buttonGroup) => {
      const buttons = buttonGroup.querySelectorAll(":scope > div")

      const removeAllActiveClasses = () => {
        buttons.forEach((button) => {
          if(button.classList.contains("active"))
          button.classList.remove("active")
        })
      }

      buttons.forEach((button) => {
        const buttonNumber = button.getAttribute("data-number")

        button.addEventListener('click', () => {
          const wasActive = button.classList.contains("active")
          removeAllActiveClasses();
          console.log('memory btn clicked')
          button.classList.add("active")
          socket.emit('memory:get', buttonNumber)
        })

        button.addEventListener('dblclick', () => {
          const wasActive = button.classList.contains("active")
          removeAllActiveClasses();
          console.log('memory btn clicked DB')
          button.classList.add("active")
          socket.emit('memory:save', buttonNumber)

        })
      })
    });
  }

  actionsForMemoryButtons();

  const actionsForMoveButtons = () => {

      const buttons = document.querySelectorAll(".button-group__updown > div")

      const removeAllActiveClasses = () => {
        buttons.forEach((button) => {
          if(button.classList.contains("active"))
          button.classList.remove("active")
        })
      }

      buttons.forEach((button) => {
        button.addEventListener('mousedown', () => {
          removeAllActiveClasses()
          button.classList.add("active")
          if(button.classList.contains('up'))
            motor('up')
          if(button.classList.contains('down'))
            motor('down')
        })
        button.addEventListener('mouseup', () => {
          console.log('onmouseup')
          removeAllActiveClasses();
          motor('stop')
        })
        // button.addEventListener('dblclick', () => {
        //   console.log('dblclick')
        //   removeAllActiveClasses();
        //     button.classList.add("active")
        //     if(button.classList.contains('up')) sendRelayPOST(getUpRelayJSON())
        //   if(button.classList.contains('down')) sendRelayPOST(getDownRelayJSON())
        //     setTimeout(() => {
        //       button.classList.remove("active")
        //       sendRelayPOST(getDefaultRelayJSON())
        //     }, 500)
        // })
      })
  }

  actionsForMoveButtons();

  /* ****************************************** */
  /* Relay debug buttons ********************** */
  const relayDebugGroup = document.querySelectorAll(".relay-debug")
  relayDebugGroup.forEach((buttonGroup) => {
    const buttons = buttonGroup.querySelectorAll(":scope > button")
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const number = button.classList[0].split("")[1];
        console.log(number)
        if(button.classList.contains("active")) {
          button.classList.remove("active")
          socket.emit('relay', {number: number, state: 1});
        } else {
          button.classList.add("active")
          socket.emit('relay', {number: number, state: 0});
        }
      })
    })
  })

});
