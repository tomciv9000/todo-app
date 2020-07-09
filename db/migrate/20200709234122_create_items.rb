class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string :description
      t.boolean :complete

      t.timestamps
    end
  end
end
