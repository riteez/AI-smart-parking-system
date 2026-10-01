import { FaDatabase } from "react-icons/fa";

function DatabaseView({ vehicles }) {
  return (
    <div className="rightCard fullWidth">
      <h2 className="tableTitle"><FaDatabase /> Registered Vehicles</h2>
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Vehicle</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Badge ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.owner_name}</td>
              <td>{v.vehicle_number}</td>
              <td>{v.phone}</td>
              <td>{v.vehicle_type}</td>
              <td>{v.barcode_id}</td>
              <td>
                <span className={v.status === "IN" ? "statusBadge in" : "statusBadge out"}>
                  {v.status === "IN" ? "Parked" : "Not in lot"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DatabaseView;
