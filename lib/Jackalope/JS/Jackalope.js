/* -------------------------------------------------------------------------------------------------- */
/*           ,---._                                                                                   */
/*         .-- -.' \                            ,-.             ,--,                                  */
/*         |    |   :                       ,--/ /|           ,--.'|            ,-.----.              */
/*         :    ;   |                     ,--. :/ |           |  | :     ,---.  \    /  \             */
/*         :        |                     :  : ' /            :  : '    '   ,'\ |   :    |            */
/*         |    :   :  ,--.--.     ,---.  |  '  /    ,--.--.  |  ' |   /   /   ||   | .\ :   ,---.    */
/*         :          /       \   /     \ '  |  :   /       \ '  | |  .   ; ,. :.   : |: |  /     \   */
/*         |    ;   |.--.  .-. | /    / ' |  |   \ .--.  .-. ||  | :  '   | |: :|   |  \ : /    /  |  */
/*     ___ l          \__\/: . ..    ' /  '  : |. \ \__\/: . .'  : |__'   | .; :|   : .  |.    ' / |  */
/*   /    /\    J   : ," .--.; |'   ; :__ |  | ' \ \," .--.; ||  | '.'|   :    |:     |`-''   ;   /|  */
/*  /  ../  `..-    ,/  /  ,.  |'   | '.'|'  : |--'/  /  ,.  |;  :    ;\   \  / :   : :   '   |  / |  */
/*  \    \         ;;  :   .'   \   :    :;  |,'  ;  :   .'   \  ,   /  `----'  |   | :   |   :    |  */
/*   \    \      ,' |  ,     .-./\   \  / '--'    |  ,     .-./---`-'           `---'.|    \   \  /   */
/*    "---....--'    `--`---'     `----'           `--`---'                       `---`     `----'    */
/*                                                                                                    */
/* -------------------------------------------------------------------------------------------------- */

function Jackalope () {}

Jackalope.VERSION   = '0.01';
Jackalope.AUTHORITY = 'cpan:STEVAN';

// ----------------------------------------------------------------------------
// Jackalope Error
// ----------------------------------------------------------------------------

Jackalope.Error = function (msg) {
    this.name    = "Jackalope Error";
    this.message = msg;
}

Jackalope.Error.prototype = {
    toString : function () { return this.message }
};

// ----------------------------------------------------------------------------
// Jackalope Serializer
// ----------------------------------------------------------------------------

Jackalope.Serializer = function () {}

Jackalope.Serializer.JSON = function () {}
Jackalope.Serializer.JSON.prototype = {
    "serialize" : function ( obj ) {
        return JSON.stringify( obj );
    },
    "deserialize" : function ( json ) {
        return JSON.parse( json );
    }
}

