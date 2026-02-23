import './Modal.css'

export default function AddRestaurantModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Add Restaurant</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <form className="modal-form">
          <label>
            <p className="form-p">Restaurant Name</p>
            <input
              placeholder="Downtown Bistro"
              className="form-input"
              type="text"
            />
          </label>

          <label>
            <p className="form-p">Description</p>
            <textarea
              placeholder="Brief description of your restaurant"
              className="form-textArea"
            />
          </label>

          <label>
            <p className="form-p">Logo URL</p>
            <input
              placeholder="Input link to your photo"
              className="form-input"
              type="text"
            />
          </label>

          <label>
            <p className="form-p">Address</p>
            <input
              placeholder="123 Street, New York"
              className="form-input"
              type="text"
            />
          </label>

          <label>
            <p className="form-p">Phone</p>
            <input
              placeholder="+48 (888) 999 000"
              className="form-input"
              type="text"
            />
          </label>

          {/* Рабочие часы */}
          <div className="working-hours">
            <p className="form-p">Working Hours</p>

            <div className="day-hours">
              <span className="day-name">Monday</span>
              <input
                type="time"
                className="form-input time-input"
                placeholder="Open"
              />
              <input
                type="time"
                className="form-input time-input"
                placeholder="Close"
              />
              <label className="closed-label">
                <input type="checkbox" />
                Closed
              </label>
            </div>

            <div className="day-hours">
              <span className="day-name">Tuesday</span>
              <input
                type="time"
                className="form-input time-input"
                placeholder="Open"
              />
              <input
                type="time"
                className="form-input time-input"
                placeholder="Close"
              />
              <label className="closed-label">
                <input type="checkbox" />
                Closed
              </label>
            </div>

            <div className="day-hours">
              <span className="day-name">Wednesday</span>
              <input
                type="time"
                className="form-input time-input"
                placeholder="Open"
              />
              <input
                type="time"
                className="form-input time-input"
                placeholder="Close"
              />
              <label className="closed-label">
                <input type="checkbox" />
                Closed
              </label>
            </div>

            <div className="day-hours">
              <span className="day-name">Thursday</span>
              <input
                type="time"
                className="form-input time-input"
                placeholder="Open"
              />
              <input
                type="time"
                className="form-input time-input"
                placeholder="Close"
              />
              <label className="closed-label">
                <input type="checkbox" />
                Closed
              </label>
            </div>

            <div className="day-hours">
              <span className="day-name">Friday</span>
              <input
                type="time"
                className="form-input time-input"
                placeholder="Open"
              />
              <input
                type="time"
                className="form-input time-input"
                placeholder="Close"
              />
              <label className="closed-label">
                <input type="checkbox" />
                Closed
              </label>
            </div>

            <div className="day-hours">
              <span className="day-name">Saturday</span>
              <input
                type="time"
                className="form-input time-input"
                placeholder="Open"
              />
              <input
                type="time"
                className="form-input time-input"
                placeholder="Close"
              />
              <label className="closed-label">
                <input type="checkbox" />
                Closed
              </label>
            </div>

            <div className="day-hours">
              <span className="day-name">Sunday</span>
              <input
                type="time"
                className="form-input time-input"
                placeholder="Open"
              />
              <input
                type="time"
                className="form-input time-input"
                placeholder="Close"
              />
              <label className="closed-label">
                <input type="checkbox" />
                Closed
              </label>
            </div>
          </div>
        </form>
        <div className="form-buttons">
          <button className="form-cancel">Cancel</button>
          <button className="form-accept">Create Restaurant</button>
        </div>
      </div>
    </div>
  )
}
