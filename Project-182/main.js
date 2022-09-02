(function() {
    var App;
  
    App = (function() {
      class App {
        constructor() {
          this.onReset = this.onReset.bind(this);
          this.onColumnOver = this.onColumnOver.bind(this);
          this.onColumnClick = this.onColumnClick.bind(this);
          this.dropChecker = this.dropChecker.bind(this);
          this.onResize = this.onResize.bind(this);
          this.render = this.render.bind(this);
          this.getElements();
          this.addListeners();
          this.render();
          this.makeChecker(this.currentColor);
        }
  
        getElements() {
          this.board = document.querySelector(".board");
          this.columns = this.board.getElementsByClassName("column");
          this.checkerHolder = document.querySelector(".checkers");
          return this.resetButton = document.querySelector(".reset");
        }
  
        addListeners() {
          var column, i, j, len, ref;
          window.addEventListener("resize", this.onResize);
          this.resetButton.addEventListener("click", this.onReset);
          i = 0;
          ref = this.columns;
          for (j = 0, len = ref.length; j < len; j++) {
            column = ref[j];
            column.setAttribute("data-num", i);
            column.addEventListener("mousemove", this.onColumnOver);
            column.addEventListener("click", this.onColumnClick);
            i++;
          }
          return this.onResize();
        }
  
        onReset() {
          var checker, j, len, ref;
          console.log("resetting");
          if (this.currentColor === "red") {
            this.currentColor = "black";
          } else {
            this.currentColor = "red";
          }
          ref = this.checkers;
          for (j = 0, len = ref.length; j < len; j++) {
            checker = ref[j];
            checker.parentNode.removeChild(checker);
          }
          this.checkers = [];
          this.columnValue = [0, 0, 0, 0, 0, 0, 0];
          return this.makeChecker(this.currentColor);
        }
  
        onColumnOver(e) {
          return this.targetColumn = parseInt(e.target.getAttribute("data-num"));
        }
  
        onColumnClick(e) {
          this.targetColumn = parseInt(e.target.getAttribute("data-num"));
          return this.dropChecker();
        }
  
        dropChecker() {
          var checker, j, len, ref, results;
          ref = this.checkers;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            checker = ref[j];
            if (checker.state.active === true && this.columnValue[this.targetColumn] < 6) {
              checker.state.x = this.bounds.width / 7 * checker.state.column;
              checker.state.row = 5 - this.columnValue[this.targetColumn];
              this.columnValue[this.targetColumn]++;
              checker.state.active = false;
              if (this.currentColor === "red") {
                this.currentColor = "black";
              } else {
                this.currentColor = "red";
              }
              results.push(this.makeChecker(this.currentColor));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
  
        onResize() {
          var s, style;
          this.bounds = this.board.getBoundingClientRect();
          s = this.bounds;
          style = `top: ${s.top}px; left:${s.left}px; width: ${s.width}px; height: ${s.height}px;`;
          this.resizing = true;
          clearTimeout(this.resizeDebounce);
          this.resizeDebounce = setTimeout(() => {
            return this.resizing = false;
          }, 60);
          return this.checkerHolder.setAttribute("style", style);
        }
  
        makeChecker(color) {
          var checker;
          checker = document.createElement("div");
          checker.setAttribute("class", `checker ${color}`);
          checker.state = {
            initialized: false,
            active: true,
            row: -1.5,
            column: 0,
            x: 0,
            y: 0
          };
          this.checkerHolder.appendChild(checker);
          return this.checkers.push(checker);
        }
  
        render() {
          requestAnimationFrame(this.render);
          return this.updateCheckers();
        }
  
        updateCheckers() {
          var checker, j, len, ref, results, targetX, targetY, u;
          ref = this.checkers;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            checker = ref[j];
            if (checker.state.active === true) {
              checker.state.column = this.targetColumn;
            }
            u = this.bounds.width / 7;
            targetX = u * checker.state.column;
            targetY = u * checker.state.row;
            if (checker.state.initialized === true && this.resizing === false) {
              checker.state.x = this.ease(checker.state.x, targetX);
              if (Math.abs(checker.state.x - targetX) < u * 0.2) {
                checker.state.y = this.ease(checker.state.y, targetY);
              }
            } else {
              checker.state.initialized = true;
              checker.state.x = targetX;
              checker.state.y = targetY;
            }
            results.push(this.transform(checker, checker.state.x, checker.state.y));
          }
          return results;
        }
  
        ease(current, target) {
          var diff;
          diff = current - target;
          if (Math.abs(diff) > 0.1) {
            return current -= diff * 0.2;
          } else {
            return current = target;
          }
        }
  
        transform(element, x, y) {
          var j, len, prefix, prefixes, results;
          prefixes = ["webkitTransform", "transform"];
          results = [];
          for (j = 0, len = prefixes.length; j < len; j++) {
            prefix = prefixes[j];
            results.push(element.style[prefix] = `translate( ${x}px , ${y}px)`);
          }
          return results;
        }
  
      };
  
      App.prototype.checkers = [];
  
      App.prototype.targetColumn = 0;
  
      App.prototype.columnValue = [0, 0, 0, 0, 0, 0, 0];
  
      App.prototype.currentColor = "red";
  
      App.prototype.resizing = false;
  
      return App;
  
    }).call(this);
  
    window.game = new App();
  
  }).call(this);
  
  //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNO0lBQU4sTUFBQSxJQUFBO01BU0UsV0FBYSxDQUFBLENBQUE7WUE0QmIsQ0FBQSxjQUFBLENBQUE7WUFVQSxDQUFBLG1CQUFBLENBQUE7WUFHQSxDQUFBLG9CQUFBLENBQUE7WUFJQSxDQUFBLGtCQUFBLENBQUE7WUFZQSxDQUFBLGVBQUEsQ0FBQTtZQW1DQSxDQUFBLGFBQUEsQ0FBQTtRQTFGRSxJQUFDLENBQUMsV0FBRixDQUFBO1FBQ0EsSUFBQyxDQUFDLFlBQUYsQ0FBQTtRQUNBLElBQUMsQ0FBQyxNQUFGLENBQUE7UUFFQSxJQUFDLENBQUMsV0FBRixDQUFjLElBQUMsQ0FBQyxZQUFoQjtNQU5XOztNQVFiLFdBQWEsQ0FBQSxDQUFBO1FBRVgsSUFBQyxDQUFDLEtBQUYsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QjtRQUNWLElBQUMsQ0FBQyxPQUFGLEdBQVksSUFBQyxDQUFDLEtBQUssQ0FBQyxzQkFBUixDQUErQixRQUEvQjtRQUNaLElBQUMsQ0FBQyxhQUFGLEdBQWtCLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCO2VBQ2xCLElBQUMsQ0FBQyxXQUFGLEdBQWdCLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCO01BTEw7O01BT2IsWUFBYyxDQUFBLENBQUE7QUFFaEIsWUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUE7UUFBSSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBbUMsSUFBQyxDQUFDLFFBQXJDO1FBQ0EsSUFBQyxDQUFDLFdBQVcsQ0FBQyxnQkFBZCxDQUErQixPQUEvQixFQUF5QyxJQUFDLENBQUMsT0FBM0M7UUFFQSxDQUFBLEdBQUk7QUFDSjtRQUFBLEtBQUEscUNBQUE7O1VBQ0UsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsVUFBcEIs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QUFtQixHQUF0QjtpQkFDRSxPQUFBLElBQVcsSUFBQSxHQUFPLElBRHBCO1NBQUEsTUFBQTtpQkFHRSxPQUFBLEdBQVUsT0FIWjs7TUFISTs7TUFRTixTQUFXLENBQUUsT0FBRixFQUFZLENBQVosRUFBZ0IsQ0FBaEIsQ0FBQTtBQUViLFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBO1FBQUksUUFBQSxHQUFXLENBQUUsaUJBQUYsRUFBc0IsV0FBdEI7QUFDWDtRQUFBLEtBQUEsMENBQUE7O3VCQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUUsTUFBRixDQUFiLEdBQTBCLENBQUEsV0FBQSxDQUFBLENBQWMsQ0FBZCxDQUFBLEtBQUEsQ0FBQSxDQUF1QixDQUF2QixDQUFBLEdBQUE7UUFENUIsQ0FBQTs7TUFIUzs7SUEzSWI7O2tCQUVFLFFBQUEsR0FBVTs7a0JBQ1YsWUFBQSxHQUFjOztrQkFDZCxXQUFBLEdBQWEsQ0FBRSxDQUFGLEVBQU0sQ0FBTixFQUFVLENBQVYsRUFBYyxDQUFkLEVBQWtCLENBQWxCLEVBQXNCLENBQXRCLEVBQTBCLENBQTFCOztrQkFFYixZQUFBLEdBQWM7O2tCQUNkLFFBQUEsR0FBVTs7Ozs7O0VBMElaLE1BQU0sQ0FBQyxJQUFQLEdBQWMsSUFBSSxHQUFKLENBQUE7QUFqSmQiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHBcbiAgXG4gIGNoZWNrZXJzOiBbXVxuICB0YXJnZXRDb2x1bW46IDBcbiAgY29sdW1uVmFsdWU6IFsgMCAsIDAgLCAwICwgMCAsIDAgLCAwICwgMCBdXG4gIFxuICBjdXJyZW50Q29sb3I6IFwicmVkXCJcbiAgcmVzaXppbmc6IGZhbHNlXG4gIFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBcbiAgICBALmdldEVsZW1lbnRzKClcbiAgICBALmFkZExpc3RlbmVycygpXG4gICAgQC5yZW5kZXIoKVxuICAgIFxuICAgIEAubWFrZUNoZWNrZXIgQC5jdXJyZW50Q29sb3JcbiAgICBcbiAgZ2V0RWxlbWVudHM6IC0+XG4gICAgXG4gICAgQC5ib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgXCIuYm9hcmRcIlxuICAgIEAuY29sdW1ucyA9IEAuYm9hcmQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSBcImNvbHVtblwiXG4gICAgQC5jaGVja2VySG9sZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciBcIi5jaGVja2Vyc1wiXG4gICAgQC5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgXCIucmVzZXRcIlxuICAgIFxuICBhZGRMaXN0ZW5lcnM6IC0+XG4gICAgXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgXCJyZXNpemVcIiAsIEAub25SZXNpemVcbiAgICBALnJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIgXCJjbGlja1wiICwgQC5vblJlc2V0XG4gICAgXG4gICAgaSA9IDBcbiAgICBmb3IgY29sdW1uIGluIEAuY29sdW1uc1xuICAgICAgY29sdW1uLnNldEF0dHJpYnV0ZSBcImRhdGEtbnVtXCIgLCBpXG4gICAgICBjb2x1bW4uYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlbW92ZVwiICwgQC5vbkNvbHVtbk92ZXJcbiAgICAgIGNvbHVtbi5hZGRFdmVudExpc3RlbmVyIFwiY2xpY2tcIiAsIEAub25Db2x1bW5DbGlja1xuICAgICAgaSsrXG4gICAgQC5vblJlc2l6ZSgpXG4gICAgXG4gIG9uUmVzZXQ6ID0+XG4gICAgICAgIFxuICAgIGNvbnNvbGUubG9nIFwicmVzZXR0aW5nXCJcbiAgICBpZiBALmN1cnJlbnRDb2xvciBpcyBcInJlZFwiIHRoZW4gQC5jdXJyZW50Q29sb3IgPSBcImJsYWNrXCIgZWxzZSBALmN1cnJlbnRDb2xvciA9IFwicmVkXCJcbiAgICBmb3IgY2hlY2tlciBpbiBALmNoZWNrZXJzXG4gICAgICBjaGVja2VyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQgY2hlY2tlclxuICAgIEAuY2hlY2tlcnMgPSBbXVxuICAgIEAuY29sdW1uVmFsdWUgPSBbIDAgLCAwICwgMCAsIDAgLCAwICwgMCAsIDAgXVxuICAgIEAubWFrZUNoZWNrZXIgQC5jdXJyZW50Q29sb3JcbiAgICBcbiAgb25Db2x1bW5PdmVyOiAoIGUgKSA9PlxuICAgIEAudGFyZ2V0Q29sdW1uID0gcGFyc2VJbnQoIGUudGFyZ2V0LmdldEF0dHJpYnV0ZSggXCJkYXRhLW51bVwiICkpXG4gICAgXG4gIG9uQ29sdW1uQ2xpY2s6ICggZSApID0+XG4gICAgQC50YXJnZXRDb2x1bW4gPSBwYXJzZUludCggZS50YXJnZXQuZ2V0QXR0cmlidXRlKCBcImRhdGEtbnVtXCIgKSlcbiAgICBALmRyb3BDaGVja2VyKClcbiAgICBcbiAgZHJvcENoZWNrZXI6ID0+XG4gICAgZm9yIGNoZWNrZXIgaW4gQC5jaGVja2Vyc1xuICAgICAgaWYgY2hlY2tlci5zdGF0ZS5hY3RpdmUgaXMgdHJ1ZSBhbmQgQC5jb2x1bW5WYWx1ZVsgQC50YXJnZXRDb2x1bW4gXSA8IDZcbiAgICAgIFxuICAgICAgICBjaGVja2VyLnN0YXRlLnggPSBALmJvdW5kcy53aWR0aCAvIDcgKiBjaGVja2VyLnN0YXRlLmNvbHVtblxuICAgICAgICBjaGVja2VyLnN0YXRlLnJvdyA9IDUgLSBALmNvbHVtblZhbHVlWyBALnRhcmdldENvbHVtbiBdXG4gICAgICAgIEAuY29sdW1uVmFsdWVbIEAudGFyZ2V0Q29sdW1uIF0rK1xuICAgICAgICBjaGVja2VyLnN0YXRlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBpZiBALmN1cnJlbnRDb2xvciBpcyBcInJlZFwiIHRoZW4gQC5jdXJyZW50Q29sb3IgPSBcImJsYWNrXCIgZWxzZSBALmN1cnJlbnRDb2xvciA9IFwicmVkXCJcbiAgICAgICAgQC5tYWtlQ2hlY2tlciBALmN1cnJlbnRDb2xvclxuICAgIFxuICBvblJlc2l6ZTogPT5cbiAgICBcbiAgICBALmJvdW5kcyA9IEAuYm9hcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBzID0gQC5ib3VuZHNcbiAgICBzdHlsZSA9IFwiXG4gICAgICB0b3A6ICN7cy50b3B9cHg7IFxuICAgICAgbGVmdDoje3MubGVmdH1weDsgXG4gICAgICB3aWR0aDogI3tzLndpZHRofXB4OyBcbiAgICAgIGhlaWdodDogI3tzLmhlaWdodH1weDtcbiAgICBcIlxuICAgIFxuICAgIEAucmVzaXppbmcgPSB0cnVlXG4gICAgY2xlYXJUaW1lb3V0IEAucmVzaXplRGVib3VuY2VcbiAgICBALnJlc2l6ZURlYm91bmNlID0gc2V0VGltZW91dCA9PlxuICAgICAgQC5yZXNpemluZyA9IGZhbHNlXG4gICAgLCA2MFxuICAgIFxuICAgIEAuY2hlY2tlckhvbGRlci5zZXRBdHRyaWJ1dGUgXCJzdHlsZVwiICwgc3R5bGVcbiAgICBcbiAgbWFrZUNoZWNrZXI6ICggY29sb3IgKSAtPlxuICAgIFxuICAgIGNoZWNrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiZGl2XCJcbiAgICBjaGVja2VyLnNldEF0dHJpYnV0ZSBcImNsYXNzXCIgLCBcImNoZWNrZXIgI3tjb2xvcn1cIlxuICAgIFxuICAgIGNoZWNrZXIuc3RhdGUgPVxuICAgICAgaW5pdGlhbGl6ZWQ6IGZhbHNlXG4gICAgICBhY3RpdmU6IHRydWVcbiAgICAgIHJvdzogLTEuNVxuICAgICAgY29sdW1uOiAwXG4gICAgICB4OiAwXG4gICAgICB5OiAwXG4gICAgICBcbiAgICBALmNoZWNrZXJIb2xkZXIuYXBwZW5kQ2hpbGQgY2hlY2tlclxuICAgIEAuY2hlY2tlcnMucHVzaCBjaGVja2VyXG4gICAgICBcbiAgcmVuZGVyOiA9PlxuICAgIFxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSBALnJlbmRlclxuICAgIEAudXBkYXRlQ2hlY2tlcnMoKVxuICAgIFxuICB1cGRhdGVDaGVja2VyczogLT5cbiAgICBcbiAgICBmb3IgY2hlY2tlciBpbiBALmNoZWNrZXJzXG4gICAgICBcbiAgICAgIGlmIGNoZWNrZXIuc3RhdGUuYWN0aXZlIGlzIHRydWUgdGhlbiBjaGVja2VyLnN0YXRlLmNvbHVtbiA9IEAudGFyZ2V0Q29sdW1uXG4gICAgICBcbiAgICAgIHUgPSBALmJvdW5kcy53aWR0aCAvIDdcbiAgICAgIFxuICAgICAgdGFyZ2V0WCA9IHUgKiBjaGVja2VyLnN0YXRlLmNvbHVtblxuICAgICAgdGFyZ2V0WSA9IHUgKiBjaGVja2VyLnN0YXRlLnJvd1xuICAgICAgXG4gICAgICBpZiBjaGVja2VyLnN0YXRlLmluaXRpYWxpemVkIGlzIHRydWUgYW5kIEAucmVzaXppbmcgaXMgZmFsc2VcbiAgICAgICAgIFxuICAgICAgICBjaGVja2VyLnN0YXRlLnggPSBALmVhc2UgY2hlY2tlci5zdGF0ZS54ICwgdGFyZ2V0WFxuICAgICAgICBpZiBNYXRoLmFicyggY2hlY2tlci5zdGF0ZS54IC0gdGFyZ2V0WCApIDwgdSAqIDAuMlxuICAgICAgICAgIGNoZWNrZXIuc3RhdGUueSA9IEAuZWFzZSBjaGVja2VyLnN0YXRlLnkgLCB0YXJnZXRZXG4gICAgICAgIFxuICAgICAgZWxzZVxuICAgICAgICBcbiAgICAgICAgY2hlY2tlci5zdGF0ZS5pbml0aWFsaXplZCA9IHRydWVcbiAgICAgICAgY2hlY2tlci5zdGF0ZS54ID0gdGFyZ2V0WFxuICAgICAgICBjaGVja2VyLnN0YXRlLnkgPSB0YXJnZXRZXG4gICAgICBcbiAgICAgIEAudHJhbnNmb3JtIGNoZWNrZXIgLCBjaGVja2VyLnN0YXRlLnggLCBjaGVja2VyLnN0YXRlLnlcbiAgICAgIFxuICBlYXNlOiAoIGN1cnJlbnQgLCB0YXJnZXQgKSAtPlxuICAgIFxuICAgIGRpZmYgPSBjdXJyZW50IC0gdGFyZ2V0XG4gICAgaWYgTWF0aC5hYnMoIGRpZmYgKSA+IDAuMVxuICAgICAgY3VycmVudCAtPSBkaWZmICogMC4yXG4gICAgZWxzZVxuICAgICAgY3VycmVudCA9IHRhcmdldFxuICAgICAgXG4gIHRyYW5zZm9ybTogKCBlbGVtZW50ICwgeCAsIHkgKSAtPlxuICAgIFxuICAgIHByZWZpeGVzID0gWyBcIndlYmtpdFRyYW5zZm9ybVwiICwgXCJ0cmFuc2Zvcm1cIiBdXG4gICAgZm9yIHByZWZpeCBpbiBwcmVmaXhlc1xuICAgICAgZWxlbWVudC5zdHlsZVsgcHJlZml4IF0gPSBcInRyYW5zbGF0ZSggI3t4fXB4ICwgI3t5fXB4KVwiXG4gICAgXG53aW5kb3cuZ2FtZSA9IG5ldyBBcHAoKSJdfQ==
  //# sourceURL=coffeescript