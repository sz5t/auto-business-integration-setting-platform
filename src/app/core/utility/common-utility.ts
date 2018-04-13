export class CommonUtility{
    static uuID(w){
      let s="";
      let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for (let i = 0; i < w; i++) {
        s += str.charAt(Math.round(Math.random() * (str.length - 1)));
      }
      return s;
    }
}