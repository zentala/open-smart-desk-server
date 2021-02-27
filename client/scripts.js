window.addEventListener('DOMContentLoaded', (event) => {

  var socket = io();
  socket.on('connect', function() {
    console.log('socket connected')
  });

  socket.on('debug', function(msg) {
    console.log(msg)
  });

  const motor = (where) => {
    socket.emit('motor', where);
  }

  let number = 0;
  const animuj = () => {
    displayNumber(number);
    number += 1;
  }
  let idInterwalu = window.setInterval(animuj, 500);

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
        button.addEventListener('click', () => {
          const wasActive = button.classList.contains("active");
          removeAllActiveClasses();
            button.classList.add("active")
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

});
