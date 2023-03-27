module.exports = `
table {
  width: 100%;
  position: relative;
  white-space: nowrap;
  border-spacing: 0;
  margin-top: 12px;
  border-collapse: collapse;
}
body {
height: fit-content;
}
.logo {
  width: 20px; height: 20px
}
.book-cell__secondary {
    font-family: -apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
    font-size: 0.65rem;
    font-weight: 800;
    line-height: 11px;
    color: #A4A4AA;
}
.book-cell__odds-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-weight: 800;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 2px 4px #a4a4aa;
  cursor: pointer;
  background-color: #f7f8fd;
  width: 80px;
  height: 40px;
  margin: auto;
}
.book-cell__odds {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 14px;
}
th {
  border-top: 1px solid rgba(164, 164, 170, 0.3);
  border-bottom: 1px solid rgba(164, 164, 170, 0.3);
  background: #f7f8fd;
  white-space: nowrap;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  z-index: 980;
  text-transform: uppercase;
  padding: 12px;
}
.grade {
  border-radius: 4px;
  border: 1px solid rgba(164, 164, 170, 0.3);
  border-right: 5px solid #3bad62;
  box-shadow: none;
  color: #1d1d25;
}
.grade .projection-cell__inner {
  text-align: center;
  padding: 12px;
  background: transparent;
  opacity: 1;
}
.grade .projection-cell__inner--locked {
  padding: 7px 12px;
}
td {
  padding: 6px;
  border-bottom: 1px solid rgba(164, 164, 170, 0.3);
}
.projections-table__column-header {
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 14px;
  color: #818188;
  white-space: nowrap;
  text-align: center;
}
.projections-table__column-header--left {
  text-align: left;
}
.projection-row__player-name {
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 18px;
  white-space: nowrap;
}
.projection-row__game-info {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 14px;
  color: #818188;
  white-space: nowrap;
}
.projection-row__bullet {
  min-width: 4px;
  min-height: 4px;
  border-radius: 50%;
  background-color: #818188;
  margin: 0 3px;
}
.projection-row__option-type {
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 18px;
  color: #0079f0;
  text-align: center;
  white-space: nowrap;
}
.projection-row__prop-name {
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 14px;
  color: #818188;
  text-align: center;
  white-space: nowrap;
}
.projection-row__pick {
  text-align: center;
}
.projection-row__cells {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  gap: 6px;
}
.projection-row__projection {
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 18px;
  text-align: center;
}
.projection-row__edge {
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 18px;
  color: #00c358;
  text-align: center;
}
.projection-row__projection-cell {
  padding: 0 12px;
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 14px;
  height: 100%;
}
`
