
module.exports.getDate = function(){
    let options = {
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      };

      let today = new Date();
      let dayToday = today.toLocaleDateString("en-US", options);
      return dayToday;
};