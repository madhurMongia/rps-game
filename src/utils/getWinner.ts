
export function getWinner(_c1: number, _c2:number): boolean {
  
    if (_c1 === -1 || _c2 === -1 || _c1 === 0 || _c2 === 0) {
      return false; 
    }
    if (_c1 === _c2) {
      return false; 
    }
    const isOdd = (move: number) => (move % 2) === 1;
  
    if (isOdd(_c1) === isOdd(_c2)) {
      return _c1 < _c2;
    } else {

      return _c1 > _c2;
    }
  }