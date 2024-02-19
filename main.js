const animate = (callback, interval) => 
{
    let previous = 0;
    const onTick = (timestamp) =>
    {
        if(timestamp - previous >= interval)
        {
            previous = timestamp;
            callback();
        }
        requestAnimationFrame(onTick);
    };
    requestAnimationFrame(onTick);
};

class Application
{
    #ctx;
    #squares = [];
    #points = [];
    #circles = [];
    #hue = 0;
    #user_color = '#ffff00';
    constructor(ctx)
    {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.transform(1, 0, 0, -1, 0, ctx.canvas.height);
        animate(this.#onTick.bind(this), 1);
        this.#ctx = ctx; 
    }

    #onTick()
    {
        this.#update();
        this.#draw();
    }

    #update()
    {

    }

    #draw()
    {
        this.#ctx.lineWidth = 1;
        this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
        //let hueOffset = this.#hue;
        for(const [x, y, color] of this.#squares)
        {
            this.#ctx.strokeRect(x, y, 10, 10);
            this.#ctx.strokeStyle = color;
            //hueOffset++;
        }
        for(let [x, y, color] of this.#points)
        {
            if(x === -100 && y === -100)
            {
                x++;
                y++;
                this.#ctx.moveTo(x, y);
            }
            else
            {
                this.#ctx.lineTo(x, y);
            }
            this.#ctx.strokeStyle = color;
        }
    }

    // Based on drawMode, add a point, circle, or square at the cursor position
    addSquare(x, y)
    {
        this.#squares.push([x-5, y-5, this.#user_color]);
    }
    addPoint(x, y)
    {
        this.#points.push([x, y, this.#user_color]);
    }
    addCircle(x, y)
    {
        this.#circles.push([x, y, this.#user_color]);
    };

    // Change user color based on numeric input
    changeUserColor(num)
    {
        if(num === 1)
        {
            this.#user_color = '#ff0000';
        }
        else if(num === 2)
        {
            this.#user_color = '#00ff00';  
        }
        else if(num === 3)
        {
            this.#user_color = '#0000ff';
        }
        else if(num === 4)
        {
            // Orange
            this.#user_color = '#ffa500';
        }
        else if(num === 5)
        {
            // Yellow
            this.#user_color = '#ffff00';
        }
        else if(num === 6)
        {
            // Purple
            this.#user_color = '#800800';
        }
        else if(num === 7)
        {
            // Brown
            this.#user_color = '#964b00';
        }
        else if(num === 8)
        {
            // Grey
            this.#user_color = '#808080';
        }
        else if(num === 9)
        {
            // Black
            this.#user_color = '#000000';
        }
        else if(num === 0)
        {
            // White
            this.#user_color = '#ffffff';
        }
    }
}
window.addEventListener('load', () =>
{
    const cvs = document.getElementById('cvs');
    const ctx = cvs.getContext('2d'); 

    const keys = new Set();

    let pointerDown = false;
    let drawMode = 1; 
    /*
        1 = Point
        2 = Square
        3 = Circle
    */

    const app = new Application(ctx);
    window.app = app;


    addEventListener('pointerdown', (event) =>
    {
        const {offsetX, offsetY} = event;
        pointerDown = true;
        if(drawMode === 1)
        {   
            app.addPoint(-100, -100);
            app.addPoint(offsetX, offsetY);
        }
        else if(drawMode === 2)
        {
            app.addSquare(offsetX, offsetY);
        }
        else
        {
            app.addCircle(offsetX, offsetY);
        }
    });

    addEventListener('pointerup', () =>
    {
        pointerDown = false;
    });

    addEventListener('pointermove', (event) =>
    {
        if(pointerDown)
        {
            const {offsetX, offsetY} = event;
            if(drawMode === 1)
            {
                app.addPoint(offsetX, offsetY);
            }
            else if(drawMode === 2)
            {
                app.addSquare(offsetX, offsetY);
            }
            else
            {
                app.addCircle(offsetX, offsetY);
            }
        }
    });

    addEventListener('keydown', (event) =>
    {
        const {key} = event;
        keys.add(key);
    });

    addEventListener('keyup', (event) => {
        const {key} = event;
        keys.delete(key);
    });

    if(keys.has('1') || keys.has('2') || keys.has('3') || keys.has('4') || keys.has('5') || keys.has('6') || keys.has('7') || keys.has('8') || keys.has('9') || keys.has('0'))
    {
        app.changeUserColor()
    }
});